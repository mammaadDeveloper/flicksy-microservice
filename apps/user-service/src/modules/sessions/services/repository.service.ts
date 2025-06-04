import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateSessionCommand, RemoveSessionCommand } from '../commands';
import { CreateSessionDto } from '../dto/create-session.dto';
import { SessionEntity } from '../entities/session.entity';
import { GetAllSessionsQuery } from '../queries';
import { FindSessionByIdQuery } from '../queries/find-by-id/find-by-id.query';

@Injectable()
export class SessionsRepositoryService {
  constructor(
    private readonly command: CommandBus,
    private readonly query: QueryBus,
  ) {}

  async findAll(): Promise<SessionEntity[]>{
    return await this.query.execute(new GetAllSessionsQuery());
  }

  async findById(id: string): Promise<SessionEntity>{
    return await this.query.execute(new FindSessionByIdQuery(id));
  }

  async create(dto: CreateSessionDto) {
    return await this.command.execute(new CreateSessionCommand(dto));
  }

  async remove(credential: {id?: string, jti?: string}) {
    await this.command.execute(new RemoveSessionCommand({ id: credential.id, jti: credential.jti }));
  }
}
