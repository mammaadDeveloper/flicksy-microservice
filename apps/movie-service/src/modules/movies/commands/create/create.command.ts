import { Command } from '@nestjs/cqrs';
import { MovieEntity } from '../../entities/movies.entity';
import { AddMovieCommand } from '../../dto/create.dto';

export class CreateMovieCommand extends Command<MovieEntity> {
  constructor(public readonly data: AddMovieCommand) {
    super();
  }
}
