import { Router } from 'express';
import * as swaggerUI from 'swagger-ui-express';
// TODO update swagger.json
import * as swaggerDocument from '../config/swagger.json';

const router = Router();

router.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export default router;
