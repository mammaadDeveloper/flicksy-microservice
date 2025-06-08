import { Exclude, Expose } from "class-transformer";
import { BaseDto } from "src/common";

@Exclude()
export class UsersCreateResponseDto extends BaseDto{
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Expose()
    email?: string;

    @Expose()
    phone?: string;

    @Expose()
    createdAt: Date;
}