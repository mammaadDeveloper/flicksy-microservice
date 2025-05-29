import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SigninV1Dto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword(
    {},
    {
      message:
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;
}
