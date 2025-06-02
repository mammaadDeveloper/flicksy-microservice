import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindResetTokenQuery } from './find-reset-token.query';
import { Repository } from 'typeorm';
import { PasswordResetTokenEntity } from '../../entities/password.entity';
import { InjectRepository } from '@nestjs/typeorm';

@QueryHandler(FindResetTokenQuery)
export class FindResetTokenQueryHandler
  implements IQueryHandler<FindResetTokenQuery>
{
  constructor(
    @InjectRepository(PasswordResetTokenEntity)
    private readonly repository: Repository<PasswordResetTokenEntity>,
  ) {}
  async execute(query: FindResetTokenQuery): Promise<PasswordResetTokenEntity> {
    const { user, token, type } = query;
    return await this.repository.findOne({
      where: { user, token, type, isUsed: false },
      relations: ['user'],
    });
  }
}
