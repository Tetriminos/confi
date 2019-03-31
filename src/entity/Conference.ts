import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  getRepository,
} from 'typeorm';
import { Booking } from './Booking';

@Entity()
export class Conference {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(type => Booking, booking => booking.conference)
  bookings: Booking[];
}

export const getConferenceRepository = () => getRepository(Conference);
