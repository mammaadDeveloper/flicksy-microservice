import { ICommand, Query } from "@nestjs/cqrs";
import { SessionEntity } from "../../entities/session.entity";
import { CreateSessionDto } from "../../dto/create-session.dto";

export class CreateSessionCommand extends Query<SessionEntity> implements ICommand{
    constructor(
        public readonly dto: CreateSessionDto
    ){
        super();
    }
}