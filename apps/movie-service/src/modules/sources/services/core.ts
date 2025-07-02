import { Injectable, NotFoundException } from '@nestjs/common';
import { SourcesRepository } from './repository';
import { SourceEntity } from '../entities/sources.entity';
import { AddSourceCommand, CreateSourceDto } from '../dto/create-source.dto';
import { MoviesService } from 'src/modules/movies/movies.service';

@Injectable()
export class CoreSources {
  constructor(
    private readonly repository: SourcesRepository,
    private readonly movieService: MoviesService,
  ) {}

  async findSourcesByMovieSlug(slug: string) {}

  async createSource(
    data: CreateSourceDto,
  ): Promise<SourceEntity | SourceEntity[]> {
    const movie = await this.movieService.findBySlug(data.movieId);

    if (!movie) throw new NotFoundException('Movie not found');

    return await this.repository.create({ ...data, movie });
  }
}
