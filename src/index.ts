import * as dotenv from 'dotenv';
dotenv.config();
import { PORT } from './config';
import app from './app';

// TODO make port an environment variable
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
