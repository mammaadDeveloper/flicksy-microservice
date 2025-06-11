import { join } from 'path';

import { ClientOptions, Transport } from '@nestjs/microservices';

export const grpcUsersOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        package: 'user',
        protoPath: join(__dirname, '..', 'proto', 'user-service.proto'),
        url: 'localhost:5001'
    }
};