import { response } from 'src/shared';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { IpAddress, UserAgent } from 'src/common';

import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';

import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { SignupV1Dto } from './dto/signup.dto';
import { SigninV1Dto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpV1Dto: SignupV1Dto) {
    const user = await this.authService.signUP(signUpV1Dto);

    return response({
      status: 'CREATED',
      message: 'Sign up successful.',
      data: {
        type: 'signup',
        id: user.id,
        attributes: user,
      },
    });
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInV1Dto: SigninV1Dto,
    @IpAddress() ip: string,
    @UserAgent() userAgent: string,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.signIn(
      signInV1Dto,
      ip,
      userAgent,
    );
    return response({
      message: 'Sign in successful.',
      data: {
        type: 'signin',
        id: user.id,
        attributes: {
          user,
          token: {
            accessToken,
            refreshToken,
          },
        },
      },
    });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @GetUser() userData: { userId: number; jti: string },
    @IpAddress() ip: string,
    @UserAgent() userAgent: string,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.refresh(
      userData.userId,
      userData.jti,
      ip,
      userAgent,
    );

    return response({
      message: 'Token refreshed successfully.',
      data: {
        type: 'refresh',
        id: user.id,
        attributes: {
          user,
          token: {
            accessToken,
            refreshToken,
          },
        },
      },
    });
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  async me(@Req() req: any) {
    const user = await this.usersService.find(req.user['userId']);

    return response({
      message: 'User retrieved successfully.',
      data: {
        type: 'me',
        id: user.id,
        attributes: user
      }
    });
  }

  @Post('signout')
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async signout(@Req() req: any) {
    await this.authService.signout(req.jti);
  }
}
