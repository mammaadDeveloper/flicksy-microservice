/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPostersQuery } from './get-all.query';
import { PosterEntity } from '../../entities/posters.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(GetAllPostersQuery)
export class GetAllPostersHandler implements IQueryHandler<GetAllPostersQuery> {
  constructor(
    @InjectRepository(PosterEntity)
    private readonly repository: Repository<PosterEntity>,
  ) {}
  async execute(query: GetAllPostersQuery): Promise<PosterEntity[]> {
    const { limit = 10, page = 1 } = query.paginate;
    return await this.repository.find({
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });
  }
}
