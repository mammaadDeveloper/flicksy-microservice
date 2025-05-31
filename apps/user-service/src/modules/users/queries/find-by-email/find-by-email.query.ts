import { UserEntity } from "../../entities/user.entity";
import { IQuery, Query } from "@nestjs/cqrs";

export class FindUserByEmailQuery extends Query<UserEntity> implements IQuery{
    constructor(public readonly email: string) {
        super();
    }
}