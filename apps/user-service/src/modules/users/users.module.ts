import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserRepositoryService } from './services/repository.service';
import { CoreUsersService } from './services/core.service';
import { FindUserQueryHandler } from './queries/find/find.handler';
import { FindUserByEmailQueryHandler } from './queries/find-by-email/find-by-email.handler';
import { PasswordController } from './password.controller';
import { UserEntity } from './entities/user.entity';
import { ChangePasswordCommandHandler, CreateUserCommandHandler } from './commands';

const commands = [CreateUserCommandHandler, ChangePasswordCommandHandler];

const queries = [FindUserQueryHandler, FindUserByEmailQueryHandler];
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [PasswordController],
  providers: [
    ...commands,
    ...queries,
    UsersService,
    UserRepositoryService,
    CoreUsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
