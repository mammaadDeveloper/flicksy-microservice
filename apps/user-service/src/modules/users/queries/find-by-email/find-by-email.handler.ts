import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindUserByEmailQuery } from "./find-by-email.query";
import { UserEntity } from "../../entities/user.entity";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailQueryHandler implements IQueryHandler<FindUserByEmailQuery>{
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>
    ){}
    async execute(query: FindUserByEmailQuery): Promise<UserEntity> {
        return await this.repository.findOneBy({email: query.email});
    }

}