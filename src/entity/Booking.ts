import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  JoinColumn,
  getRepository,
} from 'typeorm';
import { Conference } from './Conference';
import { IsPhoneNumber, IsEmail, Length } from 'class-validator';

@Entity()
@Unique(['email'])
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conferenceId: number;

  @ManyToOne(type => Conference, conference => conference.bookings)
  @JoinColumn({ name: 'conferenceId' })
  conference: Conference;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Length(1, 255)
  firstname: string;

  @Column()
  @Length(1, 255)
  lastname: string;

  @Column()
  @IsPhoneNumber(null)
  phonenumber: string;

  @Column()
  @Length(10)
  code: string;
}

export const getBookingRepository = () => getRepository(Booking);
