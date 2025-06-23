import { Query } from "@nestjs/cqrs";

export class MovieCountQuery extends Query<number>{}