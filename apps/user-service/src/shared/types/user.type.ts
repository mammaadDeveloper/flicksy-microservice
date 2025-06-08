import { UserEntity } from "src/modules/users/entities/user.entity";

export type GetUserType = {
    id: number | any;
    jti?: string;
    user?: UserEntity;
}