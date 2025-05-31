import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SigninV1Dto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { SignupV1Dto } from './dto/signup.dto';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpV1Dto: SignupV1Dto) {
    const user = await this.authService.signUP(signUpV1Dto);

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Sign up successful.',
      user,
    };
  }

  @Post('signin')
  async signIn(@Body() signInV1Dto: SigninV1Dto) {
    const { user, accessToken, refreshToken } =
      await this.authService.signIn(signInV1Dto);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Sign in successful.',
      user,
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req: any) {
    const { user, accessToken, refreshToken } = await this.authService.refresh(
      req.userId,
      req.jti,
    );

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Token refreshed successfully.',
      user,
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt-access'))
async me(@Req() req: any){
    const user = await this.usersService.find(req.user['userId']);
    
    return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'User retrieved successfully.',
        user
    }
}

  @Post('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signout(@Req() req: any){
    await this.authService.signout(req.jti);
    
    return {
        statusCode: HttpStatus.NO_CONTENT,
        success: true,
        message: 'User signout successfully.'
    }
  }
}
