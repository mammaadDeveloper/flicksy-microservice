import { Expose } from "class-transformer";
import { IsNotEmpty, IsStrongPassword } from "class-validator";

export class ChangePasswordDto{
    @Expose({name: 'current_password'})
    @IsNotEmpty()
    @IsStrongPassword()
    current: string;

    @Expose({name: 'new_password'})
    @IsNotEmpty()
    @IsStrongPassword()
    new: string;
}