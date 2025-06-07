import { IQuery, Query } from "@nestjs/cqrs";
import { SessionEntity } from "../../entities/session.entity";

export class FindSessionsByUserQuery extends Query<SessionEntity[]> implements IQuery{
    constructor(
        public readonly userId: number
    ){
        super();
    }
}