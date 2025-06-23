import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from './entities/sources.entity';
import { CreateSourceHandler } from './commands';
import { SourcesService } from './sources.service';
import { SourcesRepository } from './services/repository';

const commands = [CreateSourceHandler];

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity])],
  providers: [...commands, SourcesService, SourcesRepository],
  exports: [SourcesService],
})
export class SourcesModule {}
