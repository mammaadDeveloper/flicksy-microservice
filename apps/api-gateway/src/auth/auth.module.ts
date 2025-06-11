import { ClientsModule } from '@nestjs/microservices';
import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { grpcUsersOptions } from './auth.grpc';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_PACKAGE',
        ...grpcUsersOptions,
      },
    ]),
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
