import { Router } from 'express';
import BookingController from '../controller/BookingController';
import { checkJWT, checkRole } from '../middleware';

const router = Router();

// get all bookings for a conference
router.get(
  '/:conferenceId/bookings',
  [checkJWT, checkRole(['ADMIN'])],
  BookingController.list
);

// create a new booking
router.post('/:conferenceId/bookings', BookingController.create);

// delete a booking
router.delete(
  '/:conferenceId/bookings/:id',
  [checkJWT, checkRole(['ADMIN'])],
  BookingController.delete
);

export default router;
