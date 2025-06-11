import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { Service } from './service.service';
import { MicroServiceEntity } from './service.entity';
import { ServiceController } from './service.controller';
import * as bodyParser from 'body-parser';

@Module({
  imports: [TypeOrmModule.forFeature([MicroServiceEntity])],
  controllers: [ServiceController],
  providers: [Service],
  exports: [Service],
})
export class ServiceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(bodyParser.json({type: 'application/json'})).forRoutes(ServiceController);
  }
}
