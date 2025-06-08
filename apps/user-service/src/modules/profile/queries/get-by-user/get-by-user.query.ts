import { Query, AggregateRoot } from "@nestjs/cqrs";
import { ProfileEntity } from "../../entities/profile.entity";

export class GetProfileByUserQuery extends Query<ProfileEntity>{
    constructor(
        public readonly userId: number
    ){
        super();
    }
}