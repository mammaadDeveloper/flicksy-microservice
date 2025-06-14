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
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { LoggerModule as AppLoggerModule } from './shared/utils/logger/logger.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HealthModule } from './modules/health/health.module';
import grpcConfig from './config/grpc.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../../.env'],
      load: [appConfig, databaseConfig, jwtConfig, grpcConfig, hashingConfig],
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false
      }
    }),
    CqrsModule.forRoot(),
    ScheduleModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        // formatters: {
        //   level: (label, number) => ({level: `${label.toUpperCase()}(${number})`}),
        //   bindings: (bindings) => ({pid: bindings.pid})
        // },
        transport: {
          target: 'pino-pretty',
          options: {
            // singleLine: true,
            colorize: true,
            levelFirst: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
            messageFormat: '{method} {url} {msg} - {res.statusCode}',
            // customColors: 'error:red,info:green,debug:cyan,warn:yellow',
          }
        }
      }
    }),
    EncryptionModule,
    AuthModule,
    UsersModule,
    TokensModule,
    GrpcModule,
    PasswordResetModule,
    SessionsModule,
    AppLoggerModule,
    ProfileModule,
    HealthModule,
  ]
})
export class AppModule {}
