import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTokenByUserQuery } from './find-by-user.query';
import { PersonalAccessEntity } from '../../entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

@QueryHandler(FindTokenByUserQuery)
export class FindTokenByUserQueryHandler
  implements IQueryHandler<FindTokenByUserQuery>
{
  constructor(
    @InjectRepository(PersonalAccessEntity)
    private readonly repository: Repository<PersonalAccessEntity>,
  ) {}

  async execute(query: FindTokenByUserQuery): Promise<PersonalAccessEntity> {
    return await this.repository.findOne({
      where: {
        user: { id: query.userId },
        isRevoked: false,
        expiredAt: MoreThan(new Date()),
      },
      order: { createdAt: 'DESC' },
    });
  }
}
