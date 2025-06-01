import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { UserRepositoryService } from './services/repository.service';
import { CreateUserCommand } from './commands/create/create.command';
import { FindUserQueryHandler } from './queries/find/find.handler';
import { FindUserByEmailQueryHandler } from './queries/find-by-email/find-by-email.handler';

const commands = [CreateUserCommand];
const queries = [FindUserQueryHandler, FindUserByEmailQueryHandler];
@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [UsersService, UserRepositoryService, ...commands, ...queries],
    exports: [UsersService],
})
export class UsersModule {}
