import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllWithPaginateQuery } from './get-all.query';
import { MovieEntity } from '../../entities/movies.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(GetAllWithPaginateQuery)
export class GetAllMoviesWithPaginateHandler
  implements IQueryHandler<GetAllWithPaginateQuery>
{
  constructor(
    @InjectRepository(MovieEntity)
    private readonly repository: Repository<MovieEntity>,
  ) {}
  async execute(query: GetAllWithPaginateQuery): Promise<MovieEntity[]> {
    const { trailer, source, poster, page, limit } = query.options;
    const relations = [];

    if (trailer) relations.push('trailers');
    if (source) relations.push('sources');
    if (poster) relations.push('posters');

    return await this.repository.find({
      relations,
      take: limit,
      skip: (page - 1) * limit,
    });
  }
}
