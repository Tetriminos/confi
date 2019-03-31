import { createConnection } from 'typeorm';
import { ormConfig } from '../config';

createConnection(ormConfig).then(() => {
  console.log('Connected to db');
}).catch(err => {
  console.error('Error while connecting to db');
  console.error(err);
  process.exit(1);
});
