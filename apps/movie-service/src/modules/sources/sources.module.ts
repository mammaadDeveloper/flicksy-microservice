import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from './entities/sources.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity])],
})
export class SourcesModule {}
