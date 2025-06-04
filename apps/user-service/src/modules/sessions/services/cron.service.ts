import { Injectable, Logger } from '@nestjs/common';
import { SessionsRepositoryService } from './repository.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronSessionService {
  private readonly logger = new Logger(CronSessionService.name);
  constructor(private readonly repository: SessionsRepositoryService) {}

  @Cron(CronExpression.EVERY_DAY_AT_6PM, {name: 'session-expired'})
  async removeExpiredSessions() {
    try {
      const result = await this.repository.removeExpired();

      if (result != 0)
        this.logger.log(
          `Expired sessions remove successfully. sessions count: ${result}`,
        );
        else this.logger.error('Failed to remove expired session');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
