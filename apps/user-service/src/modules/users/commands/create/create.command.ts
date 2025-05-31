import { Command, ICommand } from "@nestjs/cqrs";
import { UserEntity } from "../../entities/user.entity";

export class CreateUserCommand extends Command<UserEntity> implements ICommand{
    constructor(public readonly data: Partial<UserEntity>){
        super();
    }
}