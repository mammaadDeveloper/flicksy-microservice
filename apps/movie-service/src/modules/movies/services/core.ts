import { Injectable, NotFoundException } from '@nestjs/common';
import { MoviesRepository } from './repository';
import { GetMoviesWithPaginateDto } from '../dto/movies.dto';
import { MovieEntity } from '../entities/movies.entity';
import { plainToInstance } from 'class-transformer';
import { MovieResponseDto } from '../dto/response.dto';
import { CreateMovieDto } from '../dto/create-movie.dto';

@Injectable()
export class CoreMoviesService {
  constructor(private readonly repository: MoviesRepository) {}

  async findAll(
    options: GetMoviesWithPaginateDto,
  ): Promise<MovieResponseDto[]> {
    const movies = await this.repository.lookupMoviesWithPaginate(options);
    return plainToInstance(MovieResponseDto, movies, {
      excludeExtraneousValues: true,
    });
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async findOne(slug: string): Promise<MovieResponseDto> {
    const movie = await this.repository.findBySlug(slug);

    if (!movie) throw new NotFoundException('Movie not found');

    return plainToInstance(MovieResponseDto, movie, {
      excludeExtraneousValues: true,
    });
  }

  async createMovie(data: CreateMovieDto): Promise<void> {
    const movie = await this.repository.create(data);

    if (data.posters) {
    }

    if (data.sources) {
    }

    if (data.trailers) {
    }
  }
}
