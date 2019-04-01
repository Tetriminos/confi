import * as request from 'supertest';
import { expect } from 'chai';

import * as jwt from 'jsonwebtoken';

import app from '../../app';
import { getBookingRepository } from '../../entity/Booking';

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

describe('HTTP routes', function() {
  // we are doing http and db related stuff, so this is a precaution
  this.timeout(4000);

  describe('POST /api/auth/login', function() {
    it('should return HTTP 200 and login the admin user while returning a json web token', async () => {
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

  describe('GET /api/conferences/:conferenceId/bookings', function() {
    beforeEach(async () => {
      const bookingRepository = getBookingRepository();
      await bookingRepository.clear();
    });

    it('should return HTTP 401 if we are not authorized', async () => {
      const response = await request(app).get('/api/conferences/1/bookings');

      expect(response.statusCode).to.equal(401);
    });

    it('should return HTTP 200 and return an empty array if no bookings were made yet', async () => {
      const response = await request(app)
        .get('/api/conferences/1/bookings')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).to.equal(200);
      expect(response.body).to.deep.equal([]);
    });

    it('should return HTTP 200 and let an authorized user (admin) list bookings', async () => {
      const bookingRepository = getBookingRepository();
      await bookingRepository.save(bookingRepository.create(bookingData1));

      const response = await request(app)
        .get('/api/conferences/1/bookings')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).to.equal(200);
      expect(response.body).to.deep.equal([bookingData1]);
    });

    it('should return HTTP 200 and an array containing two bookings if two were made', async () => {
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

  describe('POST /api/conferences/:conferenceId/bookings', function() {
    beforeEach(async () => {
      const bookingRepository = getBookingRepository();
      await bookingRepository.clear();
    });

    it('should return HTTP 204 and let an anonymouos user register for conference attendance, if he provides all of the required fields', async () => {
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

    it("shouldn return 400 and shouldn't let the user register if the conference doesn't exist", async () => {
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

    it("should return HTPP 400 and shouldn't register the user if there is another registration with the same email", async () => {
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

    it('should return HTTP 400 and the problem property if some of the required properties are not provided in the request body', async () => {
      const responseForNoFirstname = await request(app)
        .post('/api/conferences/1/bookings')
        .send({
          lastname: bookingData1.lastname,
          email: bookingData1.email,
          phonenumber: bookingData1.phonenumber,
        });

      expect(responseForNoFirstname.statusCode).to.equal(400);
      expect(responseForNoFirstname.body[0].property).to.equal('firstname');

      const responseForNoLastname = await request(app)
        .post('/api/conferences/1/bookings')
        .send({
          firstname: bookingData1.firstname,
          email: bookingData1.email,
          phonenumber: bookingData1.phonenumber,
        });

      expect(responseForNoLastname.statusCode).to.equal(400);
      expect(responseForNoLastname.body[0].property).to.equal('lastname');

      const responseForNoEmail = await request(app)
        .post('/api/conferences/1/bookings')
        .send({
          firstname: bookingData1.firstname,
          lastname: bookingData1.lastname,
          phonenumber: bookingData1.phonenumber,
        });

      expect(responseForNoEmail.statusCode).to.equal(400);
      expect(responseForNoEmail.body[0].property).to.equal('email');

      const responseForNoPhonenumber = await request(app)
        .post('/api/conferences/1/bookings')
        .send({
          firstname: bookingData1.firstname,
          lastname: bookingData1.lastname,
          email: bookingData1.email,
        });

      expect(responseForNoPhonenumber.statusCode).to.equal(400);
      expect(responseForNoPhonenumber.body[0].property).to.equal('phonenumber');
    });

    it('should return HTTP 400 if we enter an invalid email', async () => {
      const responseForNoEmail = await request(app)
        .post('/api/conferences/1/bookings')
        .send({
          firstname: bookingData1.firstname,
          lastname: bookingData1.lastname,
          phonenumber: bookingData1.phonenumber,
          email: 'someemail@a',
        });

      expect(responseForNoEmail.statusCode).to.equal(400);
      expect(responseForNoEmail.body[0].property).to.equal('email');
    });

    it('should return HTTP 400 if we enter an invalid phone number', async () => {
      const responseForNoEmail = await request(app)
        .post('/api/conferences/1/bookings')
        .send({
          firstname: bookingData1.firstname,
          lastname: bookingData1.lastname,
          phonenumber: '+38599123456', // only 6 numbers after the country and operator codes
          email: bookingData1.email,
        });

      expect(responseForNoEmail.statusCode).to.equal(400);
      expect(responseForNoEmail.body[0].property).to.equal('phonenumber');
    });
  });

  describe('DELETE /api/conferences/conferenceId/bookings/:id', function() {
    beforeEach(async () => {
      const bookingRepository = getBookingRepository();
      await bookingRepository.clear();
    });

    it('should return HTTP 401 if we are not authorized, without deleting a user', async () => {
      const bookingRepository = getBookingRepository();
      await bookingRepository.save(bookingRepository.create(bookingData1));

      const foundUser = await bookingRepository.findOne({ where: { email: bookingData1.email } });
      const userId = foundUser.id;
      expect(foundUser).to.not.be.undefined;

      const response = await request(app)
        .delete(`/api/conferences/1/bookings/${userId}`);

      expect(response.statusCode).to.equal(401);
      expect(await bookingRepository.findOne({ where: { email: bookingData1.email } })).to.not.be.undefined;
    });

    it('should return HTTP 204 and delete a user if we are an admin user', async () => {
      const bookingRepository = getBookingRepository();
      await bookingRepository.save(bookingRepository.create(bookingData1));

      const foundUser = await bookingRepository.findOne({ where: { email: bookingData1.email } });
      const userId = foundUser.id;
      expect(foundUser).to.not.be.undefined;

      const response = await request(app)
        .delete(`/api/conferences/1/bookings/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).to.equal(204);
      expect(await bookingRepository.findOne({ where: { email: bookingData1.email } })).to.be.undefined;
    });

    it('should return HTTP 400 if we\'re trying to delete a user with an existing id but for wrong conference', async () => {
      const bookingRepository = getBookingRepository();
      await bookingRepository.save(bookingRepository.create(bookingData1));

      const foundUser = await bookingRepository.findOne({ where: { email: bookingData1.email } });
      const userId = foundUser.id;
      expect(foundUser).to.not.be.undefined;

      const response = await request(app)
        .delete(`/api/conferences/2/bookings/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).to.equal(400);
      expect(await bookingRepository.findOne({ where: { email: bookingData1.email } })).to.not.be.undefined;
    });
  });
});
