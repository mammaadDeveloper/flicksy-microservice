import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    type: 'postgres',
    url: process.env.AUTH_DATABASE_URL || process.env.DATABASE_URL || '',
    synchronize: true
}));