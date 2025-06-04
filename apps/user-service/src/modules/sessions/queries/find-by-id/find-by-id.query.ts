import { IQuery, Query } from "@nestjs/cqrs";
import { SessionEntity } from "../../entities/session.entity";

export class FindSessionByIdQuery extends Query<SessionEntity> implements IQuery{
    constructor(public readonly id: string){
        super();
    }
}