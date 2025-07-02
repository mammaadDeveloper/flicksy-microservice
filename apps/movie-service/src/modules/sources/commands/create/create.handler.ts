import { DataSource } from 'typeorm';
import { AppLoggerService } from 'src/shared';

import { InjectDataSource } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateSourceCommand } from './create.command';
import { SourceEntity } from '../../entities/sources.entity';

@CommandHandler(CreateSourceCommand)
export class CreateSourceHandler
  implements ICommandHandler<CreateSourceCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService,
  ) {}
  async execute(
    command: CreateSourceCommand,
  ): Promise<SourceEntity | SourceEntity[]> {
    const { data } = command;
    const raw = Array.isArray(data) ? data : [data];
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sources = raw.map((item) =>
        queryRunner.manager.create(SourceEntity, item),
      );

      await queryRunner.manager.save(sources);

      await queryRunner.commitTransaction();
      this.logger.log('Sources created successfully.');

      return sources;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      this.logger.error('Failed to create sources.', error.message);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
