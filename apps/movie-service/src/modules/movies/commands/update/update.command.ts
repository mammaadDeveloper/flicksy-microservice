import { Command } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { ChangeMovieCommand } from '../../dto/update.dto';

export class UpdateMovieCommand extends Command<UpdateResult> {
  constructor(
    public readonly slug: string,
    public readonly data: ChangeMovieCommand,
  ) {
    super();
  }
}
