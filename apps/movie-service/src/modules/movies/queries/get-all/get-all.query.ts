import { Query } from '@nestjs/cqrs';
import { MovieEntity } from '../../entities/movies.entity';
import { GetMoviesWithPaginateDto } from '../../dto/movies.dto';

export class GetAllWithPaginateQuery extends Query<MovieEntity[]> {
  constructor(public readonly options?: GetMoviesWithPaginateDto) {
    super();
  }
}
