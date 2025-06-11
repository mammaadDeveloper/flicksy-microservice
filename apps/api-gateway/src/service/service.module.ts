import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Service } from './service.service';
import { MicroServiceEntity } from './service.entity';
import { ServiceController } from './service.controller';
import { APP_GUARD } from '@nestjs/core';
import { ServiceGuard } from './service.guard';

@Module({
  imports: [TypeOrmModule.forFeature([MicroServiceEntity])],
  controllers: [ServiceController],
  providers: [
    Service,
    {
      provide: APP_GUARD,
      useClass: ServiceGuard,
    },
  ],
  exports: [Service],
})
export class ServiceModule {}
