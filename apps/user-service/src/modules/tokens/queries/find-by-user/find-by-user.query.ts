import { IQuery, Query } from "@nestjs/cqrs";
import { PersonalAccessEntity } from "../../entities/token.entity";

export class FindTokenByUserQuery extends Query<PersonalAccessEntity> implements IQuery{
    constructor(
        public readonly userId: number
    ){
        super();
    }
}