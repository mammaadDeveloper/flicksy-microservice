/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  url:
    process.env.UPLOAD_DATABASE_URL ||
    process.env.DATABASE_URL ||
    'postgressql://localhost:5432/db',
}));
