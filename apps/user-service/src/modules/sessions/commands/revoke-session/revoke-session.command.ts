import { Command, ICommand } from "@nestjs/cqrs";
import { SessionEntity } from "../../entities/session.entity";

export class RevokeSessionCommand extends Command<SessionEntity> implements ICommand{
    constructor(
        public readonly jti: string
    ){
        super();
    }
}