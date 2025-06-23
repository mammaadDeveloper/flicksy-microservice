import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  url:
    process.env.MOVIE_DATABASE_URL ||
    process.env.DATABASE_URL ||
    'postgresql://localhost:5432/db',
  synchronize: true,
}));
