import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTrailerCommand } from './create.command';
import { TrailerEntity } from '../../entities/trailers.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppLoggerService } from 'src/shared';

@CommandHandler(CreateTrailerCommand)
export class CreateTrailerHandler
  implements ICommandHandler<CreateTrailerCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService,
  ) {}
  async execute(
    command: CreateTrailerCommand,
  ): Promise<TrailerEntity | TrailerEntity[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const trailers = command.data.map((item) =>
        queryRunner.manager.create(TrailerEntity, item),
      );

      await queryRunner.manager.save(trailers);

      await queryRunner.commitTransaction();
      this.logger.log('Trailers created successfully.');

      return trailers;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      this.logger.error('Failed to create trailers.', error.message);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
