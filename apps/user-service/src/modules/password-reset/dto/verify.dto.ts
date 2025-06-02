import { PasswordResetTokenType } from "src/shared/types/token.type";

export class VerifyRestDto{
    email: string;
    token: string;
    type: PasswordResetTokenType;
}