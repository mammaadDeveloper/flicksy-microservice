import { Command, ICommand } from "@nestjs/cqrs";

export class ResetPasswordCommand extends Command<void> implements ICommand{
    constructor(
        public readonly id: number,
        public readonly newPassword: string
    ){
        super();
    }
}