import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateSessionCommand } from '../commands';
import { CreateSessionDto } from '../dto/create-session.dto';

@Injectable()
export class SessionsRepositoryService {
  constructor(
    private readonly command: CommandBus,
    private readonly query: QueryBus,
  ) {}

  async create(dto: CreateSessionDto) {
    return await this.command.execute(new CreateSessionCommand(dto));
  }
}
