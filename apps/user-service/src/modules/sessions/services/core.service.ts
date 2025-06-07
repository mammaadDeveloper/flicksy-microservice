import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SessionsRepositoryService } from './repository.service';
import { AppLoggerService } from 'src/shared/utils/logger/logger.service';
import { plainToInstance } from 'class-transformer';
import { SessionOutDto } from '../dto/session-response.dto';
import { SessionQueryDto } from '../dto/session-query.dto';

@Injectable()
export class CoreSessionService {
  constructor(
    private readonly repository: SessionsRepositoryService,
    private readonly logger: AppLoggerService,
  ) {
    logger.setContext(CoreSessionService.name);
  }

  async findAll(userId: number, options?: SessionQueryDto): Promise<SessionOutDto[]> {
    const sessions = await this.repository.findByUser(userId, options);
    return plainToInstance(SessionOutDto, sessions, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<{id: string, instance: SessionOutDto}> {
    const session = await this.repository.findById(id);

    if (!session) throw new NotFoundException('Session not found');

    return {
      id: session.id,
      instance: plainToInstance(SessionOutDto, session, {excludeExtraneousValues: true})
    };
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

  async leaveCurrent(jti: string): Promise<void> {
    await this.repository.revoke(jti);
    this.logger.log('User leave current session', { jti });
  }

  async leaveOthers() {}
}
