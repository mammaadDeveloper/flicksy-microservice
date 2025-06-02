import { registerAs } from "@nestjs/config";

export default registerAs('hashing', () => ({
    hash: {
        algorithm: process.env.HASH_ALGORITHM || 'sha256'
    },
    encryption: {
        algorithm: process.env.CRYPTO_ALGORITHM || 'aes-256-cbc',
        secret: process.env.CRYPTO_SECRET_KEY || 'secret',
        iv_byte: 16
    }
}));