import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindResetTokenQuery } from './find-reset-token.query';
import { UserEntity } from 'src/modules/users/entities/user.entity';
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
  async execute(query: FindResetTokenQuery): Promise<UserEntity> {
    const { user, token, type } = query;
    const passwordEntity = await this.repository.findOne({
      where: { user, token, type, isUsed: false },
      relations: ['user'],
    });
    return passwordEntity.user;
  }
}
