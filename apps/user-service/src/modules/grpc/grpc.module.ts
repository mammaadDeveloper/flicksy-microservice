import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokensModule } from '../tokens/tokens.module';
import { GrpcController } from './grpc.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [JwtModule, UsersModule, TokensModule],
  controllers: [GrpcController],
})
export class GrpcModule {}
