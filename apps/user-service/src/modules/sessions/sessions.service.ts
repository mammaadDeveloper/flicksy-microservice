import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsRepositoryService } from './services/repository.service';
import { SessionEntity } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(private readonly repository: SessionsRepositoryService) {}
  async create(createSessionDto: CreateSessionDto): Promise<SessionEntity> {
    return await this.repository.create(createSessionDto);
  }

  async findAll(): Promise<SessionEntity[]> {
    return await this.repository.findAll();
  }

  async findOne(id: string): Promise<SessionEntity | null> {
    const session = await this.repository.findById(id);
    
    if(!session)
      return null;

    return session;
  }

  async remove(credential: {id?: string, jti?:string}): Promise<void>{
    await this.repository.remove(credential);
  }

  async leaveOthers() {}
}
