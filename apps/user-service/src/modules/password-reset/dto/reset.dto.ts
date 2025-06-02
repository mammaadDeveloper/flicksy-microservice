import { PasswordResetTokenType } from "src/shared/types/token.type";

export class ResetPasswordDto{
    email: string;
    token: string;
    type: PasswordResetTokenType;
    newPassword: string;
}