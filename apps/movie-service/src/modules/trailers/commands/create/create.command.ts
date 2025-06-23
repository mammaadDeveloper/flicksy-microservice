import { Command } from '@nestjs/cqrs';
import { TrailerEntity } from '../../entities/trailers.entity';
import { AddTrailerCommand } from '../../dto/create-trailer.dto';

export class CreateTrailerCommand extends Command<
  TrailerEntity | TrailerEntity[]
> {
  constructor(public readonly data: AddTrailerCommand[]) {
    super();
  }
}
