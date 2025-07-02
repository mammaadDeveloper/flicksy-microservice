import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosterEntity } from './entities/posters.entity';
import { CreatePosterHandler } from './commands';
import { PostersService } from './posters.service';
import { PosterRepository } from './services/repository';
import { PostersCoreService } from './services/core';
import { PostersController } from './posters.controller';
import { MoviesModule } from '../movies/movies.module';
import { GetAllPostersHandler } from './queries';
import { PosterCountHandler } from './queries/count/count.handler';

const commands = [CreatePosterHandler];

const queries = [GetAllPostersHandler, PosterCountHandler];
@Module({
  imports: [
    TypeOrmModule.forFeature([PosterEntity]),
    forwardRef(() => MoviesModule),
  ],
  controllers: [PostersController],
  providers: [
    ...commands,
    ...queries,
    PostersService,
    PosterRepository,
    PostersCoreService,
  ],
  exports: [PostersService],
})
export class PostersModule {}
