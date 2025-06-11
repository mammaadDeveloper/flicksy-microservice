import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindUserQuery } from "./find.query";
import { UserEntity } from "../../entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@QueryHandler(FindUserQuery)
export class FindUserQueryHandler implements IQueryHandler<FindUserQuery>{
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>
    ){}
    async execute(query: FindUserQuery): Promise<UserEntity> {
        return await this.repository.findOneBy({id: query.id});
    }

}