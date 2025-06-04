import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsRepositoryService } from './services/repository.service';
import { SessionEntity } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    private readonly repository: SessionsRepositoryService
  ){}
  async create(createSessionDto: CreateSessionDto): Promise<SessionEntity> {
    return await this.repository.create(createSessionDto);
  }

  findAll() {
    return `This action returns all sessions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }

  async leaveOthers(){

  }
}
