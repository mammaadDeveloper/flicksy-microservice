import { Command, ICommand } from "@nestjs/cqrs";
import { PasswordResetTokenEnum } from "src/shared/enums/token.enum";

export class UseResetTokenCommand extends Command<void> implements ICommand{
    constructor(
        public readonly userId: number,
        public readonly token: string,
        public readonly type: PasswordResetTokenEnum
    ){
        super();
    }
}