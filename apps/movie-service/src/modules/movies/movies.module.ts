import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movies.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CoreMoviesService } from './services/core';

@Module({
    imports: [TypeOrmModule.forFeature([MovieEntity])],
    controllers: [MoviesController],
    providers: [MoviesService, CoreMoviesService],
    exports: [MoviesService]
})
export class MoviesModule {}
