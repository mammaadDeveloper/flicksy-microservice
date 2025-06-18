import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrailerEntity } from './entities/trailers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrailerEntity])],
})
export class TrailersModule {}
