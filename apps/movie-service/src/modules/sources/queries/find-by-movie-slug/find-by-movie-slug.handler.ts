import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSourceByMovieSlugQuery } from './find-by-movie-slug.query';
import { SourceEntity } from '../../entities/sources.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(FindSourceByMovieSlugQuery)
export class FindSourceByMovieSlugHandler
  implements IQueryHandler<FindSourceByMovieSlugQuery>
{
  constructor(
    @InjectRepository(SourceEntity)
    private readonly repository: Repository<SourceEntity>,
  ) {}

  async execute(query: FindSourceByMovieSlugQuery): Promise<SourceEntity[]> {
    return await this.repository.find({
      where: { movie: { slug: query.slug } },
      order: { createdAt: 'DESC' },
    });
  }
}
