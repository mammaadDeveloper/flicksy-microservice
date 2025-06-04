import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSessionCommand } from './create-session.command';
import { SessionEntity } from '../../entities/session.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@CommandHandler(CreateSessionCommand)
export class CreateSessionCommandHandler
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

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
        isRevoked,
      });
      await repo.save(sessionEntity);

      await queryRunner.commitTransaction();

      return sessionEntity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
