import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetTokenEntity } from './entities/password.entity';
import { UsersModule } from '../users/users.module';
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';
import { PasswordRepositoryService } from './services/repository.service';
import {
  CreatePasswordResetTokenCommandHandler,
  ResetPasswordCommandHandler,
  UseResetTokenCommandHandler,
} from './commands';
import { ExistsResetTokenQueryHandler, FindResetTokenQueryHandler } from './queries';

const commands = [
  CreatePasswordResetTokenCommandHandler,
  ResetPasswordCommandHandler,
  UseResetTokenCommandHandler,
];

const queries = [FindResetTokenQueryHandler, ExistsResetTokenQueryHandler];
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
