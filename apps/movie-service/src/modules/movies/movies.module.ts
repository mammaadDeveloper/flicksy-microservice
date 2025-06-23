import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movies.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CoreMoviesService } from './services/core';
import { GetAllMoviesWithPaginateHandler, MovieCountHandler } from './queries';
import { MoviesRepository } from './services/repository';

const commands = [];

const queries = [GetAllMoviesWithPaginateHandler, MovieCountHandler];

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity])],
  controllers: [MoviesController],
  providers: [...commands, ...queries, MoviesService, CoreMoviesService, MoviesRepository],
  exports: [MoviesService],
})
export class MoviesModule {}
