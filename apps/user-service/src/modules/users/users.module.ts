import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserRepositoryService } from './services/repository.service';
import { CoreUsersService } from './services/core.service';
import { FindUserQueryHandler } from './queries/find/find.handler';
import { FindUserByEmailQueryHandler } from './queries/find-by-email/find-by-email.handler';
import { UserEntity } from './entities/user.entity';
import { CreateUserCommandHandler } from './commands';

const commands = [CreateUserCommandHandler];

const queries = [FindUserQueryHandler, FindUserByEmailQueryHandler];
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
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
