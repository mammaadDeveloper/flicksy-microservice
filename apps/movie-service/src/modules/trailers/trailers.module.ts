import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrailerEntity } from './entities/trailers.entity';
import { CreateTrailerHandler } from './commands';
import { TrailersService } from './trailers.service';
import { TrailersRepository } from './services/repository';

const commands = [CreateTrailerHandler];
@Module({
  imports: [TypeOrmModule.forFeature([TrailerEntity])],
  providers: [...commands, TrailersService, TrailersRepository],
  exports: [TrailersService],
})
export class TrailersModule {}
