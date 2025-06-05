import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SessionsRepositoryService } from './repository.service';
import { SessionEntity } from '../entities/session.entity';
import { AppLoggerService } from 'src/shared/utils/logger/logger.service';

@Injectable()
export class CoreSessionService {
  constructor(private readonly repository: SessionsRepositoryService, private readonly logger: AppLoggerService) {
    logger.setContext(CoreSessionService.name);
  }

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
      this.logger.log('Session removed');
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to remove session',
        error,
      });
    }
  }

  async leaveCurrent(jti: string): Promise<void>{
    await this.repository.revoke(jti);
    this.logger.log('User leave current session', {jti});
  }

  async leaveOthers() {}
}
