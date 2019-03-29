import { Router, Request, Response } from 'express';
import auth from './auth';
import apiDocs from './apiDocs';
import conferences from './conferences';

const routes = Router();

routes.use('/auth', auth);
routes.use('/apiDocs', apiDocs);
routes.use('/conferences', conferences);

export default routes;
