import { MoreThan, Repository } from 'typeorm';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { PasswordResetTokenEntity } from '../../entities/password.entity';
import { CheckAvailableQuery } from './check-available.query';

@QueryHandler(CheckAvailableQuery)
export class CheckAvailableQueryHandler
  implements IQueryHandler<CheckAvailableQuery>
{
  constructor(
    @InjectRepository(PasswordResetTokenEntity)
    private readonly repository: Repository<PasswordResetTokenEntity>,
  ) {}
  async execute(query: CheckAvailableQuery): Promise<boolean> {
    return await this.repository.exists({
      where: { user: { id: query.userId }, isUsed: false, expiredAt: MoreThan(new Date()) },
    });
  }
}
