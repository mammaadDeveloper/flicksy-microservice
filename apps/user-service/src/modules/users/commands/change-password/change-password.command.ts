import { Command } from "@nestjs/cqrs";
import { UserEntity } from "../../entities/user.entity";

export class ChangePasswordCommand extends Command<UserEntity>{
    constructor(
        public readonly user: UserEntity,
        public readonly password: string
    ){
        super();
    }
}