import { Command, ICommand } from "@nestjs/cqrs";
import { PasswordResetTokenEntity } from "../../entities/password.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { PasswordResetTokenType } from "src/shared/types/token.type";

export class CreatePasswordResetTokenCommand extends Command<PasswordResetTokenEntity> implements ICommand{
    constructor(
        public readonly user: UserEntity,
        public readonly token: string,
        public readonly type: PasswordResetTokenType,
        public readonly expiredAt: Date,
    ){
        super();
    }
}