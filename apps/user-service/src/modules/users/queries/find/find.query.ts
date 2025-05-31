import { IQuery, Query } from "@nestjs/cqrs";
import { UserEntity } from "../../entities/user.entity";

export class FindUserQuery extends Query<UserEntity> implements IQuery{
    constructor(public readonly id: number){
        super();
    }
}