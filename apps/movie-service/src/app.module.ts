import { LoggerModule } from 'nestjs-pino';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { LoggerModule as AppLoggerModule } from './shared';
import { TrailersModule } from './modules/trailers/trailers.module';
import { SourcesModule } from './modules/sources/sources.module';
import { PostersModule } from './modules/posters/posters.module';
import { MoviesModule } from './modules/movies/movies.module';
import { HealthModule } from './modules/health/health.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../../.env'],
      load: [appConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('db.url'),
        entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
        synchronize: config.get<boolean>('db.synchronize'),
        autoLoadEntities: true,
      }),
    }),
    CqrsModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
            messageFormat: '{method} {url} {msg} - {res.statusCode}',
          },
        },
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    HealthModule,
    MoviesModule,
    SourcesModule,
    TrailersModule,
    AppLoggerModule,
    PostersModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
