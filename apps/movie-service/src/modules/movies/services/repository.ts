import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetMoviesWithPaginateDto } from '../dto/movies.dto';
import {
  GetAllWithPaginateQuery,
  GetMovieBySlugQuery,
  MovieCountQuery,
} from '../queries';
import { MovieEntity } from '../entities/movies.entity';

@Injectable()
export class MoviesRepository {
  constructor(
    private readonly command: CommandBus,
    private readonly query: QueryBus,
  ) {}

  async lookupMoviesWithPaginate(
    options: GetMoviesWithPaginateDto,
  ): Promise<MovieEntity[]> {
    return await this.query.execute(new GetAllWithPaginateQuery(options));
  }

  async findBySlug(slug: string): Promise<MovieEntity | null> {
    return await this.query.execute(new GetMovieBySlugQuery(slug));
  }

  async count(): Promise<number> {
    return await this.query.execute(new MovieCountQuery());
  }
}
