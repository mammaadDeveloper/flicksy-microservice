import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule.forRoot({
    errorLogStyle: 'pretty',
    gracefulShutdownTimeoutMs: 3000
  })],
  controllers: [HealthController]
})
export class HealthModule {}
