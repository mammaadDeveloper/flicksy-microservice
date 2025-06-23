import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosterEntity } from './entities/posters.entity';
import { CreatePosterCommand } from './commands';
import { PostersService } from './posters.service';
import { PosterRepository } from './services/repository';

const commands = [CreatePosterCommand];
@Module({
  imports: [TypeOrmModule.forFeature([PosterEntity])],
  providers: [...commands, PostersService, PosterRepository],
  exports: [PostersService],
})
export class PostersModule {}
