import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddSourceCommand } from '../dto/create-source.dto';
import { CreateSourceCommand } from '../commands';
import { SourceEntity } from '../entities/sources.entity';

@Injectable()
export class SourcesRepository {
  constructor(private readonly command: CommandBus) {}

  async create(
    data: AddSourceCommand | AddSourceCommand[],
  ): Promise<SourceEntity | SourceEntity[]> {
    return await this.command.execute(new CreateSourceCommand(data));
  }
}
