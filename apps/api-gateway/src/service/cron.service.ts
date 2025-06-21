import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MicroServiceEntity } from './service.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CronService {
  private readonly logger = new Logger('Service health check');

  constructor(
    @InjectRepository(MicroServiceEntity)
    private readonly repository: Repository<MicroServiceEntity>,
    private readonly http: HttpService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkHealthOfService() {
    const services = await this.repository.find();

    for (const svc of services) {
      try {
        const response = await this.http
          .get(`${svc.baseUrl}/health`, { timeout: 5000 })
          .toPromise();
        const status = response.data.status === 'ok' ? 'up' : 'degraded';

        await this.repository.update(svc.id, { status });
        this.logger.log(`Service ${svc.name} is ${status}`);
      } catch (error) {
        await this.repository.update(svc.id, { status: 'down' });
        this.logger.warn(`Service ${svc.name} is down`);
      }
    }
  }
}
