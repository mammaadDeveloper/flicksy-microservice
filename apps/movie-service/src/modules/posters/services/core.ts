/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { MoviesService } from 'src/modules/movies/movies.service';
import { FormatterInterface } from 'src/shared';
import { PosterEntity } from '../entities/posters.entity';
import { PosterRepository } from './repository';
import { PaginateDto } from 'src/common';

@Injectable()
export class PostersCoreService implements FormatterInterface {
  constructor(
    private readonly repository: PosterRepository,
    private readonly moviesService: MoviesService,
  ) {}
  format<T, V>(cls: ClassConstructor<T>, data: V): T | T[] {
    throw new Error('Method not implemented.');
  }
  formatError(error: Error): never {
    throw new Error(`Method not implemented. ${error}`);
  }
  async findAll(paginate: PaginateDto): Promise<PosterEntity[]> {
    return await this.repository.all(paginate);
  }

  async findByMovieSlug(slug: string): Promise<PosterEntity[]> {
    const movie = await this.moviesService.findBySlug(slug);

    if (!movie) throw new NotFoundException('Movie not found');

    return movie.posters;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
