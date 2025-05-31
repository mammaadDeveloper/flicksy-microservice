import { Command, ICommand } from "@nestjs/cqrs";
import { PersonalAccessEntity } from "../../entities/token.entity";

export class RevokeByJtiCommand extends Command<PersonalAccessEntity> implements ICommand{
    constructor(
        public readonly jti: string
    ){
        super();
    }
}