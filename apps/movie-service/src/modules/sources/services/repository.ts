import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddSourceCommand } from '../dto/create-source.dto';
import { CreateSourceCommand } from '../commands';
import { SourceEntity } from '../entities/sources.entity';
import { FindSourceByMovieSlugQuery } from '../queries';

@Injectable()
export class SourcesRepository {
  constructor(
    private readonly command: CommandBus,
    private readonly query: QueryBus,
  ) {}

  async create(
    data: AddSourceCommand | AddSourceCommand[],
  ): Promise<SourceEntity | SourceEntity[]> {
    return await this.command.execute(new CreateSourceCommand(data));
  }

  async byMovieSlug(slug: string): Promise<SourceEntity[]> {
    return await this.query.execute(new FindSourceByMovieSlugQuery(slug));
  }
}
