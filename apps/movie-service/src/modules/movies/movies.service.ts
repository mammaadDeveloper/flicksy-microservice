import { Injectable } from '@nestjs/common';
import { MovieEntity } from './entities/movies.entity';
import { MoviesRepository } from './services/repository';

@Injectable()
export class MoviesService {
  constructor(private readonly repository: MoviesRepository) {}

  async findBySlug(slug: string): Promise<MovieEntity | null> {
    const movie = await this.repository.findBySlug(slug);

    if (!movie) return null;

    return movie;
  }
}
