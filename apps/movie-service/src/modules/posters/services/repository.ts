import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddPosterCommand } from '../dto/create-poster.dto';
import { CreatePosterCommand } from '../commands';
import { PosterEntity } from '../entities/posters.entity';

@Injectable()
export class PosterRepository {
  constructor(private readonly command: CommandBus) {}

  async create(
    data: AddPosterCommand[],
  ): Promise<PosterEntity | PosterEntity[]> {
    return await this.command.execute(new CreatePosterCommand(data));
  }
}
