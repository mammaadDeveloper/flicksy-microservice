import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => ({
    secret: process.env.AUTH_JWT_SECRET || process.env.JWT_SECRET || 'secret',
    expiresAt: process.env.AUTH_JWT_EXPIRES_AT || process.env.JWT_EXPIRES_AT || '15m',
    refresh: {
        secret: process.env.AUTH_JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        expiresAt: process.env.AUTH_JWT_REFRESH_EXPIRES_AT || process.env.JWT_REFRESH_EXPIRES_AT || '7d'
    }
}));