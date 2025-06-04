import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteExpiredSessionCommand } from './delete-expired.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from '../../entities/session.entity';

@CommandHandler(DeleteExpiredSessionCommand)
export class DeleteExpiredSessionCommandHandler
  implements ICommandHandler<DeleteExpiredSessionCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
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

      return result.affected;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
