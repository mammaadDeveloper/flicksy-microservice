import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllSessionsQuery } from './get-all-sessions.query';
import { SessionEntity } from "../../entities/session.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@QueryHandler(GetAllSessionsQuery)
export class GetAllSessionsQueryHandler implements IQueryHandler<GetAllSessionsQuery>{
    constructor(
        @InjectRepository(SessionEntity)
        private readonly repository: Repository<SessionEntity>
    ){}
    async execute(query: GetAllSessionsQuery): Promise<SessionEntity[]> {
        return await this.repository.find();
    }

}