import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UsersCreateResponseDto{
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    phone: string;

    @Expose()
    createdAt: Date;
}