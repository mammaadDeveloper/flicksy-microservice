import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import {
    CreatePasswordResetTokenCommandHandler, ResetPasswordCommandHandler, UseResetTokenCommandHandler
} from './commands';
import { PasswordResetTokenEntity } from './entities/password.entity';
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';
import { ExistsResetTokenQueryHandler, FindResetTokenQueryHandler } from './queries';
import { CheckAvailableQueryHandler } from './queries/check-available/check-available.handler';
import { PasswordRepositoryService } from './services/repository.service';

const commands = [
  CreatePasswordResetTokenCommandHandler,
  ResetPasswordCommandHandler,
  UseResetTokenCommandHandler,
];

const queries = [
  FindResetTokenQueryHandler,
  ExistsResetTokenQueryHandler,
  CheckAvailableQueryHandler,
];
@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetTokenEntity]), UsersModule],
  controllers: [PasswordResetController],
  providers: [
    ...commands,
    ...queries,
    PasswordResetService,
    PasswordRepositoryService,
  ],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
