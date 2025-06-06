import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteExpiredTokensCommand } from './delete-expired.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, LessThan } from 'typeorm';
import { PersonalAccessEntity } from '../../entities/token.entity';

@CommandHandler(DeleteExpiredTokensCommand)
export class DeleteExpiredTokensCommandHandler
  implements ICommandHandler<DeleteExpiredTokensCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  async execute(command: DeleteExpiredTokensCommand): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tokens = await queryRunner.manager.find(PersonalAccessEntity, {
        where: { expiredAt: LessThan(new Date()) },
      });

      await queryRunner.manager.remove(tokens);
      
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
