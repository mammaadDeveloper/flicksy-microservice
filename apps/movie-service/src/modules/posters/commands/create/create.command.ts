import { Command } from '@nestjs/cqrs';
import { PosterEntity } from '../../entities/posters.entity';
import { AddPosterCommand } from '../../dto/create-poster.dto';

export class CreatePosterCommand extends Command<
  PosterEntity | PosterEntity[]
> {
  constructor(public readonly data: AddPosterCommand[]) {
    super();
  }
}
