import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { UserEntity } from "../entities/user.entity";
import { CreateUserCommand } from "../commands/create/create.command";
import { FindUserQuery } from "../queries/find/find.query";
import { FindUserByEmailQuery } from "../queries/find-by-email/find-by-email.query";

@Injectable()
export class UserRepositoryService{
    constructor(
        private readonly command: CommandBus,
        private readonly query: QueryBus
    ){}

    async create(user: Partial<UserEntity>): Promise<UserEntity>{
        return await this.command.execute(new CreateUserCommand(user));
    }

    async find(id: number): Promise<UserEntity>{
        return await this.query.execute(new FindUserQuery(id));
    }

    async findByEmail(email: string): Promise<UserEntity | null>{
        return await this.query.execute(new FindUserByEmailQuery(email));
    }
}