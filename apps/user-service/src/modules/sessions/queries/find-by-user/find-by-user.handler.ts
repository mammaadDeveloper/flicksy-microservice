import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSessionsByUserQuery } from './find-by-user.query';
import { SessionEntity } from '../../entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(FindSessionsByUserQuery)
export class FindSessionsByUserQueryHandler
  implements IQueryHandler<FindSessionsByUserQuery>
{
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repository: Repository<SessionEntity>,
  ) {}
  async execute(query: FindSessionsByUserQuery): Promise<SessionEntity[]> {
    return await this.repository.find({
      where: { user: { id: query.userId } },
    });
  }
}
