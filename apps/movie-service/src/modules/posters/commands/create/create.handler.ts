import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePosterCommand } from './create.command';
import { PosterEntity } from '../../entities/posters.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppLoggerService } from 'src/shared';

@CommandHandler(CreatePosterCommand)
export class CreatePosterHandler
  implements ICommandHandler<CreatePosterCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService,
  ) {}
  async execute(
    command: CreatePosterCommand,
  ): Promise<PosterEntity | PosterEntity[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const posters = command.data.map((item) =>
        queryRunner.manager.create(PosterEntity, item),
      );

      await queryRunner.manager.save(posters);

      await queryRunner.commitTransaction();
      this.logger.log('Poster created successfully.');

      return posters;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      this.logger.error('Failed to create poster.', error.message);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
