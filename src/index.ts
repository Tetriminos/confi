import 'reflect-metadata';
import * as dotenv from "dotenv";
dotenv.config();
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { connect } from './db';
import routes from './routes';
import config from './config';

connect()
  .then(async connection => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // middleware
    app.use(bodyParser.json());

    // routes
    app.use('/api', routes);

    // TODO make port an environment variable
    app.listen(config.port, () => {
        console.log(`Server started on port ${config.port}!`);
    });
  })
  .catch(error => console.log(error));
