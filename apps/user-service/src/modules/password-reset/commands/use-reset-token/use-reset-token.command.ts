import { Command, ICommand } from "@nestjs/cqrs";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { PasswordResetTokenType } from "src/shared/types/token.type";

export class UseResetTokenCommand extends Command<UserEntity> implements ICommand{
    constructor(
        public readonly user: UserEntity,
        public readonly token: string,
        public readonly type: PasswordResetTokenType
    ){
        super();
    }
}