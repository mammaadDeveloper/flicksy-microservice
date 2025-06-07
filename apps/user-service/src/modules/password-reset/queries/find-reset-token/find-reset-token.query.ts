import { IQuery, Query } from "@nestjs/cqrs";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { PasswordResetTokenEnum } from "src/shared/enums/token.enum";
import { PasswordResetTokenEntity } from "../../entities/password.entity";

export class FindResetTokenQuery extends Query<PasswordResetTokenEntity> implements IQuery{
    constructor(
        public readonly user: UserEntity,
        public readonly token: string,
        public readonly type: PasswordResetTokenEnum
    ){
        super();
    }
}