import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './modules/health/health.module';
import { MoviesModule } from './modules/movies/movies.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

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
    HealthModule,
    MoviesModule,
  ],
})
export class AppModule {}
