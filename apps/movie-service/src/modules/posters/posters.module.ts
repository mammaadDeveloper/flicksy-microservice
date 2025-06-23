import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosterEntity } from './entities/posters.entity';
import { CreatePosterHandler } from './commands';
import { PostersService } from './posters.service';
import { PosterRepository } from './services/repository';

const commands = [CreatePosterHandler];
@Module({
  imports: [TypeOrmModule.forFeature([PosterEntity])],
  providers: [...commands, PostersService, PosterRepository],
  exports: [PostersService],
})
export class PostersModule {}
