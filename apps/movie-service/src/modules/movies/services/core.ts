import { Injectable } from '@nestjs/common';
import { MoviesRepository } from './repository';
import { GetMoviesWithPaginateDto } from '../dto/movies.dto';
import { MovieEntity } from '../entities/movies.entity';

@Injectable()
export class CoreMoviesService {
  constructor(private readonly repository: MoviesRepository) {}

  async findAll(options: GetMoviesWithPaginateDto): Promise<MovieEntity[]> {
    return await this.repository.lookupMoviesWithPaginate(options);
  }

  async count(): Promise<number>{
    return await this.repository.count();
  }
}
