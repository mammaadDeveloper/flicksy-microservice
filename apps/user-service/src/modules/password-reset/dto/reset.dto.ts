import { PasswordResetTokenEnum } from "src/shared/enums/token.enum";

export class ResetPasswordDto{
    email: string;
    token: string;
    type: PasswordResetTokenEnum;
    newPassword: string;
}