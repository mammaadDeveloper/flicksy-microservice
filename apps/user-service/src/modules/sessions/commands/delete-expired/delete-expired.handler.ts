import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteExpiredSessionCommand } from './delete-expired.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from '../../entities/session.entity';
import { AppLoggerService } from 'src/shared/utils/logger/logger.service';

@CommandHandler(DeleteExpiredSessionCommand)
export class DeleteExpiredSessionCommandHandler
  implements ICommandHandler<DeleteExpiredSessionCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService
  ) {
    logger.setContext(DeleteExpiredSessionCommandHandler.name);
  }
  async execute(command: DeleteExpiredSessionCommand): Promise<number> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager
        .getRepository(SessionEntity)
        .createQueryBuilder()
        .delete()
        .where('expiredAt < :now', { now: new Date() })
        .orWhere('isRevoked = :isRevoked', {isRevoked: true})
        .execute();

      await queryRunner.commitTransaction();

      this.logger.log('Session deleted successfully');

      return result.affected;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to delete session', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
