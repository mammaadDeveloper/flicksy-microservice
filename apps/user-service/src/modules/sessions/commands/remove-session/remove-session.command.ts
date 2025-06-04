import { Command, ICommand } from "@nestjs/cqrs";

export class RemoveSessionCommand extends Command<void> implements ICommand{
    constructor(public readonly credential: {id?: string, jti?: string}){
        super();
    }
}