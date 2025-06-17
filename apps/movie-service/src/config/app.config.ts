import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    port: process.env.MOVIE_PORT || process.env.PORT || 4002,
}));