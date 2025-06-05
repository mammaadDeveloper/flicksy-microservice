import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSessionCommand } from './create-session.command';
import { SessionEntity } from '../../entities/session.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as dayjs from 'dayjs';
import { AppLoggerService } from 'src/shared/utils/logger/logger.service';

@CommandHandler(CreateSessionCommand)
export class CreateSessionCommandHandler
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService
  ) {
    logger.setContext(CreateSessionCommandHandler.name);
  }

  async execute(command: CreateSessionCommand): Promise<SessionEntity> {
    const {
      dto: { ip, jti, userId, user_agent, isRevoked },
    } = command;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(SessionEntity);

      const sessionEntity = repo.create({
        jti,
        user: { id: userId },
        ipAddress: ip,
        userAgent: user_agent,
        expiredAt: dayjs().add(30, 'day').toDate(),
        isRevoked,
      });
      await repo.save(sessionEntity);

      await queryRunner.commitTransaction();

      this.logger.log('Session created successfully');

      return sessionEntity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to create session', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
