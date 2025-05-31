import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RevokeByJtiCommand } from './revoke-by-jti.command';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PersonalAccessEntity } from '../../entities/token.entity';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(RevokeByJtiCommand)
export class RevokeByJtiCommandHandler
  implements ICommandHandler<RevokeByJtiCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  async execute(command: RevokeByJtiCommand): Promise<PersonalAccessEntity> {
    const { jti } = command;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(PersonalAccessEntity);
      const tokenEntity = await repo.findOne({ where: { jti } });

      if (!tokenEntity) throw new NotFoundException('Token not found');

      tokenEntity.isRevoked = true;
      tokenEntity.lastUsedAt = new Date();
      await repo.save(tokenEntity);
      await queryRunner.commitTransaction();

      return tokenEntity;
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
