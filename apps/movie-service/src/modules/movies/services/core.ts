import { Injectable, NotFoundException } from '@nestjs/common';
import { MoviesRepository } from './repository';
import { GetMoviesWithPaginateDto } from '../dto/movies.dto';
import { MovieEntity } from '../entities/movies.entity';
import { plainToInstance } from 'class-transformer';
import { MovieResponseDto } from '../dto/response.dto';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { PostersService } from 'src/modules/posters/posters.service';
import { SourcesService } from 'src/modules/sources/sources.service';

@Injectable()
export class CoreMoviesService {
  constructor(
    private readonly repository: MoviesRepository,
    private readonly postersService: PostersService,
    private readonly sourcesService: SourcesService,
  ) {}

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
      const posters = await this.postersService.create(data.posters);
    }

    if (data.sources) {
      const sources = await this.sourcesService.create(data.sources);
    }

    if (data.trailers) {
    }
  }
}
