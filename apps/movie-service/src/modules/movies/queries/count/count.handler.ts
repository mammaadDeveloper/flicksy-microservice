import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { MovieCountQuery } from "./count.query";
import { InjectRepository } from "@nestjs/typeorm";
import { MovieEntity } from "../../entities/movies.entity";
import { Repository } from "typeorm";

@QueryHandler(MovieCountQuery)
export class MovieCountHandler implements IQueryHandler<MovieCountQuery>{
    constructor(
        @InjectRepository(MovieEntity)
        private readonly repository: Repository<MovieEntity>
    ){}

    async execute(query: MovieCountQuery): Promise<number> {
        return await this.repository.count();
    }
}