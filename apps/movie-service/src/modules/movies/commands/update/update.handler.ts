/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMovieCommand } from './update.command';
import { DataSource, UpdateResult } from 'typeorm';
import { MovieEntity } from '../../entities/movies.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { AppLoggerService } from 'src/shared';

@CommandHandler(UpdateMovieCommand)
export class UpdateMovieHandler implements ICommandHandler<UpdateMovieCommand> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService,
  ) {
    logger.setContext(UpdateMovieHandler.name);
  }

  async execute(command: UpdateMovieCommand): Promise<UpdateResult> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.update(
        MovieEntity,
        { slug: command.slug },
        command.data,
      );

      await queryRunner.commitTransaction();
      this.logger.log('Movie updated successfully', { slug: command.slug });
      return result;
    } catch (error) {
      console.log(error);

      this.logger.error('Failed to update movie', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
