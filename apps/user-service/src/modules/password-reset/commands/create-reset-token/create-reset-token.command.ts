import { Command, ICommand } from "@nestjs/cqrs";
import { PasswordResetTokenEntity } from "../../entities/password.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { PasswordResetTokenEnum } from "src/shared/enums/token.enum";

export class CreatePasswordResetTokenCommand extends Command<PasswordResetTokenEntity> implements ICommand{
    constructor(
        public readonly user: UserEntity,
        public readonly token: string,
        public readonly type: PasswordResetTokenEnum,
        public readonly expiredAt: Date,
    ){
        super();
    }
}