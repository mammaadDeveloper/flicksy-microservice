import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByMovieSlugQuery } from './get-by-movie.query';
import { PosterEntity } from '../../entities/posters.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(GetByMovieSlugQuery)
export class GetByMovieSlugHandler
  implements IQueryHandler<GetByMovieSlugQuery>
{
  constructor(
    @InjectRepository(PosterEntity)
    private readonly repository: Repository<PosterEntity>,
  ) {}

  async execute(query: GetByMovieSlugQuery): Promise<PosterEntity[]> {
    return await this.repository.find({
      where: { movie: { slug: query.slug } },
    });
  }
}
