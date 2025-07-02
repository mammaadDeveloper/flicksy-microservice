import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PosterCountQuery } from './count.query';
import { InjectRepository } from '@nestjs/typeorm';
import { PosterEntity } from '../../entities/posters.entity';
import { Repository } from 'typeorm';

@QueryHandler(PosterCountQuery)
export class PosterCountHandler implements IQueryHandler<PosterCountQuery> {
  constructor(
    @InjectRepository(PosterEntity)
    private readonly repository: Repository<PosterEntity>,
  ) {}
  async execute(query: PosterCountQuery): Promise<number> {
    return await this.repository.count();
  }
}
