import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import {
  CreateSessionCommandHandler,
  DeleteExpiredSessionCommandHandler,
  RemoveSessionCommandHandler,
  RevokeSessionCommandHandler,
} from './commands';
import { SessionsRepositoryService } from './services/repository.service';
import { GetAllSessionsQueryHandler } from './queries';
import { CoreSessionService } from './services/core.service';
import { CronSessionService } from './services/cron.service';

const commands = [
  CreateSessionCommandHandler,
  RemoveSessionCommandHandler,
  RevokeSessionCommandHandler,
  DeleteExpiredSessionCommandHandler,
];

const queries = [GetAllSessionsQueryHandler];

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  controllers: [SessionsController],
  providers: [
    ...commands,
    ...queries,
    SessionsService,
    SessionsRepositoryService,
    CoreSessionService,
    CronSessionService
  ],
  exports: [SessionsService],
})
export class SessionsModule {}
