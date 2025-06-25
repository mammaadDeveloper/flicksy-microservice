/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MoviesRepository } from './repository';
import { GetMoviesWithPaginateDto } from '../dto/movies.dto';
import { MovieEntity } from '../entities/movies.entity';
import { plainToInstance } from 'class-transformer';
import { MovieResponseDto } from '../dto/response.dto';
import { CreateMovieDto } from '../dto/create.dto';
import { PostersService } from 'src/modules/posters/posters.service';
import { SourcesService } from 'src/modules/sources/sources.service';
import { TrailersService } from 'src/modules/trailers/trailers.service';
import { UpdateMovieDto } from '../dto/update.dto';

@Injectable()
export class CoreMoviesService {
  constructor(
    private readonly repository: MoviesRepository,
    private readonly postersService: PostersService,
    private readonly sourcesService: SourcesService,
    private readonly trailersService: TrailersService,
  ) {}

  private format(
    data: MovieEntity | MovieEntity[],
  ): MovieResponseDto | MovieResponseDto[] {
    return plainToInstance(MovieResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(
    options: GetMoviesWithPaginateDto,
  ): Promise<MovieResponseDto | MovieResponseDto[]> {
    const movies = await this.repository.lookupMoviesWithPaginate(options);
    return this.format(movies);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async findOne(slug: string): Promise<MovieResponseDto | MovieResponseDto[]> {
    const movie = await this.repository.findBySlug(slug);

    if (!movie) throw new NotFoundException('Movie not found');

    return this.format(movie);
  }

  async createMovie(
    data: CreateMovieDto,
  ): Promise<{ attributes: unknown; relationships: unknown }> {
    const movie = this.format(await this.repository.create(data));

    let posters;
    let sources;
    let trailers;

    if (data.posters) {
      posters = await this.postersService.create(data.posters);
    }

    if (data.sources) {
      sources = await this.sourcesService.create(data.sources);
    }

    if (data.trailers) {
      trailers = await this.trailersService.create(data.trailers);
    }

    return {
      attributes: movie,
      relationships: {
        posters,
        sources,
        trailers,
      },
    };
  }

  async updateMovie(
    slug: string,
    data: UpdateMovieDto,
  ): Promise<MovieResponseDto | MovieResponseDto[]> {
    const result = await this.repository.update(slug, data);

    if (result.affected === 0)
      throw new InternalServerErrorException('Failed to update movie');

    return await this.findOne(slug);
  }
}
