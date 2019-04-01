# Confi
Confi - a comfy conference booking system

## Development notes
* Make sure that you have Node 8 or higher installed
* Make sure you have docker and docker-compose installed

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

### Production notes
We use the `synchronize: true` flag in our orm config, which can be dangerous in production (data loss). We should remove it for actual production deployment, and initialize the database tables either manually, or leaving the flag up for the first run, or by generating an initialization migration via TypeORM `typeorm migration:generate -n InitializeMigration` and running it via the TypeORM CLI once.

## API
API docs are hosted on `/api/apiDocs`, and an exported Postman collection can be found in the docs folder