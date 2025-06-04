import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SessionsRepositoryService } from './repository.service';
import { SessionEntity } from '../entities/session.entity';

@Injectable()
export class CoreSessionService {
  constructor(private readonly repository: SessionsRepositoryService) {}

  async findAll(): Promise<SessionEntity[]> {
    return await this.repository.findAll();
  }

  async findOne(id: string): Promise<SessionEntity> {
    const session = await this.repository.findById(id);

    if (!session) throw new NotFoundException('Session not found');

    return session;
  }

  async remove(token: string): Promise<void> | never {
    try {
      await this.repository.remove({ jti: token });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to remove session',
        error,
      });
    }
  }

  async leaveOthers() {}
}
