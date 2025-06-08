import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CoreUsersService } from './services/core.service';
import { GetUser } from 'src/common';
import { GetUserType } from 'src/shared/types/user.type';
import { ChangePasswordDto } from './dto/password.dto';
import { response } from 'src/shared';

@Controller({
  version: '1',
  path: 'password',
})
@UseGuards(JwtAccessGuard)
export class PasswordController {
  constructor(private readonly usersService: CoreUsersService) {}

  @Patch('change')
  async changePassword(
    @GetUser() user: GetUserType,
    @Body() body: ChangePasswordDto,
  ) {
    const result = await this.usersService.changePassword(user.id, body.current, body.new);
    return response({
      message: 'Password changed successfully',
      data: {
        type: 'Update password',
        attributes: result
      },
    });
  }
}
