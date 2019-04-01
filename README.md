# Confi

Confi - a comfy conference booking system

## Development notes

- Make sure that you have Node 8 or higher installed
- Make sure you have docker and docker-compose installed

#### create an .env file and put it in the root of the project, e.g.:

```
PORT=3001
JWT_SECRET=jsfkfsdalasdffds
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres2
POSTGRES_DB=confi
POSTGRES_TEST_DB=confi_test
GMAIL_ADDRESS=confi.for.the.martians2@gmail.com
GMAIL_PASSWORD=conf1martian2
NODE_ENV=development
```

For development with the debugger exposed on port 9229, run:

```sh
npm run docker:debug
```

... which will start our web service on port 3000, and a postgres container as the db (exposed at port `5444` for ease of use)

To test, one can run:

```sh
npm run docker:test
```

... which will start the mocha test suite, alongside the postgres container with the test db

You can also run all of the configurations (start, debug, test) without Docker, provided that you:

```sh
npm install
```

... and create an `.env` file in the project root directory OR export all of the variables noted in the `.env` file

### Production notes

We use the `synchronize: true` flag in our orm config, which can be dangerous in production (data loss). We should remove it for actual production deployment, and initialize the database tables either manually, or leaving the flag up for the first run, or by generating an initialization migration via TypeORM `typeorm migration:generate -n InitializeMigration` and running it via the TypeORM CLI once.

## API

API docs are hosted on `/api/apiDocs`, and an exported Postman collection can be found in the docs folder

## Scaling notes

If the app were to grow, the following should be considered and done:

- If we add the feature to support more conferences, we need to make sure that a user can register for multiple conferences with one email
- If the throughput becomes huge (probably unlikely for this use-case), [scale nodemailer](https://nodemailer.com/usage/bulk-mail/)
- Make it possible to add multiple admin accounts, create concept of a user that is more than just a booking
- Expose conference adding REST API

## User stories

Features:

- [x] Admin login (since we are on a budget, lets go with hardcoded Basic auth or simple jwt auth)
- [x] Admin should be able to list bookings
- [x] Admin should be able to delete a booking
- [x] Anonymous user should be able to register for conference attendance, there are couple
      of required fields; for example: firstname, lastname, email and phone number
- [x] After successful registration for a conference we should send email to the user, where
      he gets a confirmation code, that he can use on entrance to the conference

Required:

- [x] Node.js (Koa | **Express**) - REST API
- [x] Database (MongoDb | MySQL | **PgSQL**)
- [x] Documentation (**Swagger** | **Postman**)
- [x] **Unit**/**integration** tests

Bonus:

- [x] TypeScript
- [x] Docker

#### Dependencies used

Dependencies:

- **bcryptjs** - best security practices advise us to avoid the built-in **crypto** library, and we should never write crypto ourselves
- **body-parser** - saves us a huge amount of clutter in response handling logic
- **class-validator** - we should always use some form of validation for user-received properties
- **dotenv** - this one is not necessary if we use only docker and docker-compose, but nice to have if we don't
- **express** - lol
- **jsonwebtoken** - not necessary if we use basic auth, but jwt is better
- **nodemailer** - hugely popular, 0 dependencies, what isn't there to love
- **pg** - db driver
- **reflect-metadata** - typeorm needs it for its decorator syntax
- **swagger-ui-express** - really not necessary, but I like it
- **typeorm** - easiest way to avoid injections and make code cleaner - an ORM

Dev dependencies:

- **mocha** - test driver
- **chai** - test assertion library, we use expect due to familiarity
- **supertest** - high-level abstraction for testing HTTP
- **ts-node** - for TypeScript
- **ts-node-dev** - for TypeScript
- **typescript** - for TypeScr... waaaait a moment.
- and a bunch of **@types** to make our dev experience nicer