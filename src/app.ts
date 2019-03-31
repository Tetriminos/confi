import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import './db';
import routes from './routes';

// create express app
const app = express();

// middleware
app.use(bodyParser.json());

// routes
app.use('/api', routes);

export default app;
