import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from './entities/sources.entity';
import { CreateSourceCommand } from './commands';

const commands = [CreateSourceCommand];

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity])],
  providers: [...commands],
})
export class SourcesModule {}
