import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetMovieBySlugQuery } from "./get-by-slug.query";
import { MovieEntity } from "../../entities/movies.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@QueryHandler(GetMovieBySlugQuery)
export class GetMovieBySlugHandler implements IQueryHandler<GetMovieBySlugQuery>{
    constructor(
        @InjectRepository(MovieEntity)
        private readonly repository: Repository<MovieEntity>
    ){}

    async execute(query: GetMovieBySlugQuery): Promise<MovieEntity | null> {
        return await this.repository.findOne({where: {slug: query.slug}});
    }
}