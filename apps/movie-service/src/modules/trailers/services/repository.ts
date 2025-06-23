import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddTrailerCommand } from '../dto/create-trailer.dto';
import { TrailerEntity } from '../entities/trailers.entity';
import { CreateTrailerCommand } from '../commands';

@Injectable()
export class TrailersRepository {
  constructor(private readonly command: CommandBus) {}

  async create(
    data: AddTrailerCommand[],
  ): Promise<TrailerEntity | TrailerEntity[]> {
    return await this.command.execute(new CreateTrailerCommand(data));
  }
}
