import { Request, Response } from 'express';
import { validate } from 'class-validator';
import * as crypto from 'crypto';

import { getBookingRepository } from '../entity/Booking';
import { sendCodeViaEMail } from '../services/email';

export default class BookingController {
  static list = async (req: Request, res: Response) => {
    const conferenceId = req.params.conferenceId;

    if (!conferenceId) {
      res.status(400).send('No conference id provided');
      return;
    }

    const bookingRepository = getBookingRepository();
    let bookings;
    try {
      bookings = await bookingRepository.find({
        select: [
          'email',
          'firstname',
          'lastname',
          'phonenumber',
          'conferenceId',
          'code',
          'id',
        ],
        where: { conferenceId },
      });
    } catch (error) {
      res.status(400).send('An error occurred whilst retreiving bookings');
      return;
    }

    res.send(bookings);
  };

  static create = async (req: Request, res: Response) => {
    const conferenceId = req.params.conferenceId;

    if (!conferenceId) {
      res.status(400).send('No conference id provided');
      return;
    }

    const { firstname, lastname, email, phonenumber } = req.body;

    const bookingRepository = getBookingRepository();
    let booking = bookingRepository.create({
      firstname,
      lastname,
      email,
      phonenumber,
      conferenceId,
      code: await generateCode(),
    });

    const errors = await validate(booking);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await bookingRepository.save(booking);
    } catch (err) {
      res.status(400).send('An error ocurred while saving your booking');
      return;
    }

    res.status(204).send();
    await sendCodeViaEMail(booking.email, booking.code);
  };

  static delete = async (req: Request, res: Response) => {
    const conferenceId = req.params.conferenceId;

    if (!conferenceId) {
      res.status(400).send('No conference id provided');
      return;
    }

    const id = req.params.id;

    const bookingRepository = getBookingRepository();
    try {
      const { affected } = await bookingRepository.delete({ id, conferenceId });
      if (affected !== 1) {
        res.status(400).send('No such booking');
        return;
      }
    } catch (err) {
      res.status(400).send('An error occurred while processing your request');
      return;
    }

    res.status(204).send();
  };
}

const generateCode = async (): Promise<string> => {
  const random10Characters: string = crypto
    .randomBytes(5)
    .toString('hex')
    .toUpperCase();

  // if we're so unlucky that the code already exists, we try again
  const bookingsWithSameCode = await getBookingRepository().find({
    where: { code: random10Characters },
  });
  if (bookingsWithSameCode.length > 0) {
    return await generateCode();
  }

  return random10Characters;
};
