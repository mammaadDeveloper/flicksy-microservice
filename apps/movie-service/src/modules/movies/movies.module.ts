import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movies.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CoreMoviesService } from './services/core';
import {
  GetAllMoviesWithPaginateHandler,
  GetMovieBySlugHandler,
  MovieCountHandler,
} from './queries';
import { MoviesRepository } from './services/repository';
import { CreateMovieHandler } from './commands';
import { PostersModule } from '../posters/posters.module';

const commands = [CreateMovieHandler];

const queries = [
  GetAllMoviesWithPaginateHandler,
  MovieCountHandler,
  GetMovieBySlugHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity]), PostersModule],
  controllers: [MoviesController],
  providers: [
    ...commands,
    ...queries,
    MoviesService,
    CoreMoviesService,
    MoviesRepository,
  ],
  exports: [MoviesService],
})
export class MoviesModule {}
