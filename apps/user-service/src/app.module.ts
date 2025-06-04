import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { AuthModule } from './modules/auth/auth.module';
import { GrpcModule } from './modules/grpc/grpc.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { UsersModule } from './modules/users/users.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PasswordResetModule } from './modules/password-reset/password-reset.module';
import { EncryptionModule } from './shared/utils/encryption/encryption.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import hashingConfig from './config/hashing.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../../.env'],
      load: [appConfig, databaseConfig, jwtConfig, hashingConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('database.url'),
        entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: false,
        autoLoadEntities: true,
      }),
    }),
    CqrsModule.forRoot(),
    EncryptionModule,
    AuthModule,
    UsersModule,
    TokensModule,
    GrpcModule,
    PasswordResetModule,
    SessionsModule,
  ]
})
export class AppModule {}
