import { registerAs } from "@nestjs/config";

export default registerAs('grpc', () => ({
    package: process.env.GRPC_PACKAGE || 'user',
    proto: process.env.GRPC_PROTO || 'user-service.proto',
    url: process.env.GRPC_URL || 'localhost:5001'
}));