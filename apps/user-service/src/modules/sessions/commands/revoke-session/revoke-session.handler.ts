import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RevokeSessionCommand } from './revoke-session.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, MoreThan } from 'typeorm';
import { SessionEntity } from '../../entities/session.entity';
import { UnauthorizedException } from '@nestjs/common';
import { AppLoggerService } from 'src/shared/utils/logger/logger.service';

@CommandHandler(RevokeSessionCommand)
export class RevokeSessionCommandHandler
  implements ICommandHandler<RevokeSessionCommand>
{
  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
    private readonly logger: AppLoggerService
  ) {
    logger.setContext(RevokeSessionCommandHandler.name);
  }

  async execute(command: RevokeSessionCommand): Promise<SessionEntity> {
    const { jti } = command;
    const queryRunner = this.datasource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sessionEntity = await queryRunner.manager.findOne(SessionEntity, {
        where: { jti, isRevoked: false, expiredAt: MoreThan(new Date()) },
      });

      if (!sessionEntity || sessionEntity.isRevoked)
        throw new UnauthorizedException('Session invalid or revoked');
    
      sessionEntity.isRevoked = true;
      sessionEntity.loggedOutAt = new Date();
      await queryRunner.manager.save(sessionEntity);

      await queryRunner.commitTransaction();

      this.logger.log('Session revoked successfully');

      return sessionEntity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to revoking session', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
