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
    const { id, jti, ipAddress, userAgent, isRevoked } = query.options;

    const where: any = {
      user: { id: query.userId },
    };

    if (id) where.id = id;
    if (jti) where.jti = jti;
    if (ipAddress) where.ipAddress = ipAddress;
    if (userAgent) where.userAgent = userAgent;
    if (typeof isRevoked === 'boolean') where.isRevoked = isRevoked;

    return await this.repository.find({ where });
  }
}
