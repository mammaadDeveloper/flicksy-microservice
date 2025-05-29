import { IsEmail, IsNotEmpty, IsPhoneNumber, IsStrongPassword, ValidateIf } from "class-validator";

export class SignupV1Dto{
    @IsNotEmpty()
    username: string;

    @ValidateIf((o) => !o.phone)
    @IsEmail()
    email: string;
    
    @ValidateIf((o) => !o.email)
    @IsPhoneNumber('IR', {message: 'Invalid phone number format.'})
    phone: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}