import { Request, Response } from 'express';
import { getRepository, Code } from 'typeorm';
import { validate } from 'class-validator';
import * as crypto from 'crypto';

import { Booking } from '../entity/Booking';

export default class BookingController {
  static list = async (req: Request, res: Response) => {
    const conferenceID = req.params.conferenceId;

    if (!conferenceID) {
      res.status(400).send();
      return;
    }

    const bookingRepository = getRepository(Booking);
    let bookings;
    try {
      bookings = await bookingRepository.find({
        select: ['email', 'firstname', 'lastname', 'phonenumber', 'conferenceId', 'code'],
        where: { conferenceId: conferenceID }
      });
    } catch (error) {
      res.status(400).send();
      return;
    }

    res.send(bookings);
  };

  static create = async (req: Request, res: Response) => {
    const conferenceId = req.params.conferenceId;
    const { firstname, lastname, email, phonenumber } = req.body;

    const bookingRepository = getRepository(Booking);
    let booking = bookingRepository.create({
      firstname,
      lastname,
      email,
      phonenumber,
      conferenceId,
      code: await generateCode()
    });

    const errors = await validate(booking);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await bookingRepository.save(booking);
    } catch (err) {
      res.status(400).send();
      return;
    }

    res.status(204).send('Booking created');
  };

  static delete = async (req: Request, res: Response) => {
    const conferenceId = req.params.conferenceId;
    const id = req.params.id;

    const bookingRepository = getRepository(Booking);
    try {
      await bookingRepository.delete(id);
    } catch (err) {
      res.status(400).send();
      return;
    }

    res.status(204).send();
  }
}

const generateCode = async () => {
  const random10Characters = crypto.randomBytes(5).toString('hex').toUpperCase();

  // if we're so unlucky that the code already exists, we try again
  const bookingRepository = getRepository(Booking);
  const bookingsWithSameCode = await bookingRepository.find({ where: { code: random10Characters} });
  if (bookingsWithSameCode.length > 0) {
    return await generateCode();
  }

  return random10Characters;
}
