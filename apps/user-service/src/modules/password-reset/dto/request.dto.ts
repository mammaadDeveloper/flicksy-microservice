import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { PasswordResetTokenEnum } from 'src/shared/enums/token.enum';

export class RequestPasswordResetDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @IsEnum(PasswordResetTokenEnum, { message: 'Invalid token type' })
  type: PasswordResetTokenEnum;
}
