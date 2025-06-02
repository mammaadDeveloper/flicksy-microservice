import { IQuery, Query } from "@nestjs/cqrs";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { PasswordResetTokenType } from "src/shared/types/token.type";
import { PasswordResetTokenEntity } from "../../entities/password.entity";

export class FindResetTokenQuery extends Query<PasswordResetTokenEntity> implements IQuery{
    constructor(
        public readonly user: UserEntity,
        public readonly token: string,
        public readonly type: PasswordResetTokenType
    ){
        super();
    }
}