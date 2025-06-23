import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './modules/health/health.module';
import { MoviesModule } from './modules/movies/movies.module';
import { SourcesModule } from './modules/sources/sources.module';
import { TrailersModule } from './modules/trailers/trailers.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { LoggerModule } from 'nestjs-pino';
import { LoggerModule as AppLoggerModule } from './shared';
import { PostersModule } from './modules/posters/posters.module';

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
    HealthModule,
    MoviesModule,
    SourcesModule,
    TrailersModule,
    AppLoggerModule,
    PostersModule,
  ],
})
export class AppModule {}
