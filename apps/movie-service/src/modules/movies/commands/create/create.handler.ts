/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMovieCommand } from './create.command';
import { MovieEntity } from '../../entities/movies.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppLoggerService } from 'src/shared';

@CommandHandler(CreateMovieCommand)
export class CreateMovieHandler implements ICommandHandler<CreateMovieCommand> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(command: CreateMovieCommand): Promise<MovieEntity> {
    const { director, slug, summary, title, year, description, releaseDate } =
      command.data;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const movie = queryRunner.manager.create(MovieEntity, {
        director,
        slug,
        summary,
        title,
        year,
        description,
        releaseDate,
      });

      await queryRunner.manager.save(movie);

      await queryRunner.commitTransaction();
      this.logger.log('Movie created successfully.');

      return movie;
    } catch (error) {
      this.logger.error('Failed to create movie.', error.message);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
