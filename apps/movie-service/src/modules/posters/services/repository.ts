import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddPosterCommand } from '../dto/create-poster.dto';
import { CreatePosterCommand } from '../commands';
import { PosterEntity } from '../entities/posters.entity';
import { GetAllPostersQuery } from '../queries';
import { PaginateDto } from 'src/common';
import { PosterCountQuery } from '../queries/count/count.query';

@Injectable()
export class PosterRepository {
  constructor(
    private readonly command: CommandBus,
    private readonly query: QueryBus,
  ) {}

  async create(
    data: AddPosterCommand[],
  ): Promise<PosterEntity | PosterEntity[]> {
    return await this.command.execute(new CreatePosterCommand(data));
  }

  async all(paginate: PaginateDto): Promise<PosterEntity[]> {
    return await this.query.execute(new GetAllPostersQuery(paginate));
  }

  async count(): Promise<number> {
    return await this.query.execute(new PosterCountQuery());
  }
}
