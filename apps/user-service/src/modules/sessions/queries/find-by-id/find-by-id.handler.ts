import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindSessionByIdQuery } from "./find-by-id.query";
import { SessionEntity } from "../../entities/session.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@QueryHandler(FindSessionByIdQuery)
export class FindSessionByIdQueryHandler implements IQueryHandler<FindSessionByIdQuery>{
    constructor(
        @InjectRepository(SessionEntity)
        private readonly repository: Repository<SessionEntity>
    ){}
    async execute(query: FindSessionByIdQuery): Promise<SessionEntity> {
        return await this.repository.findOne({where: {id: query.id}});
    }

}