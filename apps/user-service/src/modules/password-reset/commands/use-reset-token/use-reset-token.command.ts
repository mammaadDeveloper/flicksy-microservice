import { Command, ICommand } from "@nestjs/cqrs";
import { PasswordResetTokenType } from "src/shared/types/token.type";

export class UseResetTokenCommand extends Command<void> implements ICommand{
    constructor(
        public readonly userId: number,
        public readonly token: string,
        public readonly type: PasswordResetTokenType
    ){
        super();
    }
}