import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RevokeByJtiCommand } from './revoke-by-jti.command';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PersonalAccessEntity } from '../../entities/token.entity';
import { NotFoundException } from '@nestjs/common';
import { AppLoggerService } from 'src/shared/utils/logger/logger.service';

@CommandHandler(RevokeByJtiCommand)
export class RevokeByJtiCommandHandler
  implements ICommandHandler<RevokeByJtiCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService
  ) {
    logger.setContext(RevokeByJtiCommandHandler.name);
  }

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

      this.logger.log('Revoking refresh token successfully');

      return tokenEntity;
    } catch (err) {
        await queryRunner.rollbackTransaction();
        this.logger.error('Failed to revoking refresh token', err.message);
        throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
