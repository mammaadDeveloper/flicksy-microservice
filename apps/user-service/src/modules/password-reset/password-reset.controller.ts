import { Body, Controller, HttpCode, HttpStatus, Post, Version } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { RequestPasswordResetDto } from './dto/request.dto';
import { VerifyRestDto } from './dto/verify.dto';
import { PasswordResetService } from './password-reset.service';
import { ResetPasswordDto } from './dto/reset.dto';

@Controller({
  version: '1',
  path: 'password-reset'
})
export class PasswordResetController {
  constructor(
    private readonly passwordResetService: PasswordResetService,
    private readonly usersService: UsersService,
  ) {}

  @Post('request')
  @HttpCode(HttpStatus.CREATED)
  async requestPasswordReset(@Body() body: RequestPasswordResetDto) {
    const { type, email } = body;
    const user = await this.usersService.findByEmail(email);
    const token = await this.passwordResetService.generate(user, type);

    return {
      status: HttpStatus.CREATED,
      success: true,
      message: 'Password reset token generated successfully',
      data: {
        token: process.env.NODE_ENV !== 'production' ? token : undefined,
      },
    };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyPasswordResetToken(@Body() body: VerifyRestDto) {
    const { email, token, type } = body;

    const user = await this.usersService.findByEmail(email);

    await this.passwordResetService.verify(user.id, type, token);

    return {
      statusCode: HttpStatus.OK,
      status: 'OK',
      success: true,
      message: 'Token verified successfully'
    }
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDto){
    const { email, token, type, newPassword } = body;

    const user = await this.usersService.findByEmail(email);

    await this.passwordResetService.find({token, type, user});
    
    await this.passwordResetService.reset(user.id, newPassword);

    return {
      status: HttpStatus.OK,
      success: true,
      message: 'Password reset successfully',
      data: {
        user,
      },
    };
  }
}
