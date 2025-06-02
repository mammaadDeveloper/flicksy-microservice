import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { PasswordResetTokenType } from 'src/shared/types/token.type';

export class RequestPasswordResetDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @IsEnum(PasswordResetTokenType, { message: 'Invalid token type' })
  type: PasswordResetTokenType;
}
