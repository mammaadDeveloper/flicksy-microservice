import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveSessionCommand } from './remove-session.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from '../../entities/session.entity';
import { NotFoundException } from '@nestjs/common';
import { AppLoggerService } from 'src/shared/utils/logger/logger.service';

@CommandHandler(RemoveSessionCommand)
export class RemoveSessionCommandHandler
  implements ICommandHandler<RemoveSessionCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService
  ) {
    logger.setContext(RemoveSessionCommandHandler.name);
  }
  async execute(command: RemoveSessionCommand): Promise<void> {
    const {
      credential: { id, jti },
    } = command;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const session = queryRunner.manager.findOne(SessionEntity, {
        where: [{ id }, { jti }],
      });
      
      if(!session)
        throw new NotFoundException('Session not found.');

      await queryRunner.manager.remove(session);

      this.logger.log('Session removed successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to remove session', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
