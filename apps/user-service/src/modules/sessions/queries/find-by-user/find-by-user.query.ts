import { IQuery, Query } from "@nestjs/cqrs";
import { SessionEntity } from "../../entities/session.entity";
import { SessionQueryDto } from "../../dto/session-query.dto";

export class FindSessionsByUserQuery extends Query<SessionEntity[]> implements IQuery{
    constructor(
        public readonly userId: number,
        public readonly options?: SessionQueryDto
    ){
        super();
    }
}