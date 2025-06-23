import { Command } from '@nestjs/cqrs';
import { SourceEntity } from '../../entities/sources.entity';
import { AddSourceCommand } from '../../dto/create-source.dto';

export class CreateSourceCommand extends Command<
  SourceEntity | SourceEntity[]
> {
  constructor(public readonly data: AddSourceCommand[]) {
    super();
  }
}
