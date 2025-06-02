import { IQuery, Query } from "@nestjs/cqrs";
import { UserEntity } from "src/modules/users/entities/user.entity";

export class CheckAvailableQuery extends Query<boolean> implements IQuery {
    constructor(public readonly userId: number){
        super();
    }
}