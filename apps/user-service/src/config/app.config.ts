import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    name: process.env.AUTH_APP_NAME || process.env.APP_NAME || 'Auth Service',
    port: parseInt(process.env.AUTH_PORT, 10) || parseInt(process.env.PORT, 10) || 3010
}));