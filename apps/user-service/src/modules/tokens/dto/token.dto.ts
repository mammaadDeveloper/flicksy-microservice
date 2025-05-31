import { UserEntity } from "src/modules/users/entities/user.entity";
import { PersonalAccessEntity } from "../entities/token.entity";

export class CreateTokenCommandDto{
    token: string;
    expiredAt: Date;
    user: UserEntity;
    parent?: PersonalAccessEntity;
    jti: string;
    type: 'access' | 'refresh' = 'refresh';
    isRevoked?: boolean = false;
}