import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { Service } from './service.service';
import { MicroServiceEntity } from './service.entity';
import { ServiceController } from './service.controller';
import * as bodyParser from 'body-parser';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { CronService } from './cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([MicroServiceEntity]), ScheduleModule.forRoot(), HttpModule],
  controllers: [ServiceController],
  providers: [Service, CronService],
  exports: [Service],
})
export class ServiceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(bodyParser.json({type: 'application/json'})).forRoutes(ServiceController);
  }
}
