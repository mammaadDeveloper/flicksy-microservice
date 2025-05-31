import { IQuery, Query } from "@nestjs/cqrs";
import { PersonalAccessEntity } from "../../entities/token.entity";

export class FindByJtiQuery extends Query<PersonalAccessEntity> implements IQuery{
    constructor(
        public readonly jti: string
    ){
        super();
    }
}