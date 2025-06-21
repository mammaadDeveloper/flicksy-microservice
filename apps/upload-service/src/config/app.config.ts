/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(
    (process.env.UPLOAD_PORT || process.env.APP_PORT) ?? '3000',
    10,
  ),
  static: {
    url:
      process.env.NODE_ENV === 'production'
        ? process.env.STATICE_URL
        : `http://localost:${process.env.UPLOAD_PORT || process.env.APP_PORT}`,
  },
}));
