import { FormatterInterface } from 'src/shared';
import { MoviesService } from 'src/modules/movies/movies.service';
import { ClassConstructor, plainToInstance } from 'class-transformer';

import { Injectable, NotFoundException } from '@nestjs/common';

import { SourcesRepository } from './repository';
import { SourceResponseDto } from '../dto/response.dto';
import { CreateSourceDto } from '../dto/create-source.dto';

@Injectable()
export class CoreSources implements FormatterInterface {
  constructor(
    private readonly repository: SourcesRepository,
    private readonly movieService: MoviesService,
  ) {}
  format<T, V>(cls: ClassConstructor<T>, data: V): T | T[] {
    return plainToInstance(cls, data, { excludeExtraneousValues: true });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formatError(error: Error): never {
    throw new Error('Method not implemented.');
  }

  async findSourcesByMovieSlug(
    slug: string,
  ): Promise<SourceResponseDto | SourceResponseDto[]> {
    const sources = await this.repository.byMovieSlug(slug);

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!sources || sources.length === 0)
      throw new NotFoundException(
        'Sources for the requested movie were not found.',
      );

    return this.format(SourceResponseDto, sources);
  }

  async createSource(
    data: CreateSourceDto,
  ): Promise<SourceResponseDto | SourceResponseDto[]> {
    const movie = await this.movieService.findBySlug(data.movieId);

    if (!movie) throw new NotFoundException('Movie not found');

    const source = await this.repository.create({ ...data, movie });

    return this.format(SourceResponseDto, source);
  }
}
