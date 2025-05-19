import { Module } from '@nestjs/common';
import { RegistryService } from './registry.service';
import { RegistryController } from './registry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service])
  ],
  controllers: [RegistryController],
  providers: [RegistryService],
  exports: [RegistryService]
})
export class RegistryModule {}
