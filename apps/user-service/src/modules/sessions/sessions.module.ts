import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { CreateSessionCommandHandler } from './commands';
import { SessionsRepositoryService } from './services/repository.service';

const commands = [CreateSessionCommandHandler];

const queries = [];

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  controllers: [SessionsController],
  providers: [...commands, ...queries, SessionsService, SessionsRepositoryService],
  exports: [SessionsService],
})
export class SessionsModule {}
