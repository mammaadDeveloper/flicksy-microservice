import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindByJtiQuery } from './find-by-jti.query';
import { PersonalAccessEntity } from '../../entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(FindByJtiQuery)
export class FindByJtiQueryHandler implements IQueryHandler<FindByJtiQuery> {
  constructor(
    @InjectRepository(PersonalAccessEntity)
    private readonly repository: Repository<PersonalAccessEntity>,
  ) {}
  async execute(query: FindByJtiQuery): Promise<PersonalAccessEntity> {
    const { jti } = query;
    return await this.repository.findOneBy({ jti });
  }
}
