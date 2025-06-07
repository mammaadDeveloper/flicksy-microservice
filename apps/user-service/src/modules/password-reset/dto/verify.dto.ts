import { PasswordResetTokenEnum } from "src/shared/enums/token.enum";

export class VerifyRestDto{
    email: string;
    token: string;
    type: PasswordResetTokenEnum;
}