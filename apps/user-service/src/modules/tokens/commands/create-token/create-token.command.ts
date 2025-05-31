import { Command, ICommand } from "@nestjs/cqrs";
import { PersonalAccessEntity } from "../../entities/token.entity";
import { CreateTokenCommandDto } from "../../dto/token.dto";

export class CreateTokenCommand extends Command<PersonalAccessEntity> implements ICommand{
    constructor(public readonly dto: CreateTokenCommandDto){
        super();
    }
}