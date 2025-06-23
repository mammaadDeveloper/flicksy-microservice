import { Query } from "@nestjs/cqrs";
import { MovieEntity } from "../../entities/movies.entity";

export class GetMovieBySlugQuery extends Query<MovieEntity | null>{
    constructor(public readonly slug: string){
        super();
    }
}