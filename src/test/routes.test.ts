import * as request from 'supertest';
import { expect } from 'chai';

import * as jwt from 'jsonwebtoken';

import app from '../app';
import { getBookingRepository } from '../entity/Booking';

const token = jwt.sign(
  { userId: 1, username: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

const bookingData1 = {
  email: 'someemail@email.com',
  firstname: 'Name',
  lastname: 'LastName',
  phonenumber: '+385994441121',
  conferenceId: 1,
  code: 'AAABBBCCC1',
};
const bookingData2 = {
  email: 'someotheremail@email.com',
  firstname: 'Name',
  lastname: 'LastName',
  phonenumber: '+385994441121',
  conferenceId: 1,
  code: 'AAABBBCCC2',
};

describe('POST /api/auth/login', function() {
  it('should return a valid token for the admin user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin',
      });

    expect(response.statusCode).to.equal(200);
    expect(response.text).to.not.be.null;
    const payload: any = jwt.verify(response.text, process.env.JWT_SECRET);
    expect(payload.username).to.equal('admin');
  });

  it('should return HTTP 401 if the wrong password is entered', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'administrator',
      });

    expect(response.statusCode).to.equal(401);
    expect(response.text).to.equal('');
    expect(response.body).to.be.empty;
  });

  it('should return HTTP 404 if the user does not exist', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'administrator',
        password: 'admin',
      });

    expect(response.statusCode).to.equal(404);
    expect(response.text).to.equal('');
    expect(response.body).to.be.empty;
  });
});

describe('GET /api/conferences/:conferenceId/bookings', () => {
  beforeEach(async () => {
    const bookingRepository = getBookingRepository();
    await bookingRepository.clear();
  });

  it('should fail if we are not authorized', async () => {
    const response = await request(app).get('/api/conferences/1/bookings');

    expect(response.statusCode).to.equal(401);
  });

  it('should return an empty array if no bookings were made yet', async () => {
    const response = await request(app)
      .get('/api/conferences/1/bookings')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.deep.equal([]);
  });

  it('should return an array containing the booking if one was made', async () => {
    const bookingRepository = getBookingRepository();
    await bookingRepository.save(bookingRepository.create(bookingData1));

    const response = await request(app)
      .get('/api/conferences/1/bookings')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.deep.equal([bookingData1]);
  });

  it('should return an array containing two bookings if two were made', async () => {
    const bookingRepository = getBookingRepository();
    await bookingRepository.save(bookingRepository.create(bookingData1));
    await bookingRepository.save(bookingRepository.create(bookingData2));

    const response = await request(app)
      .get('/api/conferences/1/bookings')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.deep.equal([bookingData1, bookingData2]);
  });
});

describe('POST /api/conferences/:conferenceId/bookings', () => {
  beforeEach(async () => {
    const bookingRepository = getBookingRepository();
    await bookingRepository.clear();
  });

  it('should successfully register a user', async () => {
    const response = await request(app)
      .post('/api/conferences/1/bookings')
      .send({
        firstname: bookingData1.firstname,
        lastname: bookingData1.lastname,
        email: bookingData1.email,
        phonenumber: bookingData1.phonenumber,
      });

    expect(response.statusCode).to.equal(204);
  });

  it("shouldn't register a user if the conference doesn't exist", async () => {
    const response = await request(app)
      .post('/api/conferences/2/bookings')
      .send({
        firstname: bookingData1.firstname,
        lastname: bookingData1.lastname,
        email: bookingData1.email,
        phonenumber: bookingData1.phonenumber,
      });

    expect(response.statusCode).to.equal(400);
  });

  it("shouldn't register a user if the email was already registered with", async () => {
    const bookingRepository = getBookingRepository();
    await bookingRepository.save(bookingRepository.create(bookingData1));

    const response = await request(app)
      .post('/api/conferences/1/bookings')
      .send({
        firstname: bookingData1.firstname,
        lastname: bookingData1.lastname,
        email: bookingData1.email,
        phonenumber: bookingData1.phonenumber,
      });

    expect(response.statusCode).to.equal(400);
  });
});
