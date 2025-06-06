import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SigninV1Dto } from './dto/signin.dto';
import { compareHash } from 'src/shared/utils/hash.util';
import { TokensService } from '../tokens/tokens.service';
import { SignupV1Dto } from './dto/signup.dto';
import { UserEntity } from '../users/entities/user.entity';
import { SessionsService } from '../sessions/sessions.service';
import { Request } from 'express';
import { AppLoggerService } from 'src/shared/utils/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly sessionsService: SessionsService,
    private readonly logger: AppLoggerService
  ) {}

  async signUP({ username, email, phone, password }: SignupV1Dto) {
    if (!email && !phone)
      throw new BadRequestException('Email or phone number is required.');

    const user = await this.usersService.create({
      username,
      email,
      phone,
      password,
    });

    if (!user)
      throw new HttpException(
        'User creation failed.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      this.logger.log('User signed up successfully');

    return user;
  }

  async signIn(
    { email, password }: SigninV1Dto,
    ip: string,
    userAgent: string,
  ): Promise<{
    user: UserEntity;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new NotFoundException('User not found.');

    if (!compareHash(password, user.password))
      throw new HttpException('Invalid credentials.', HttpStatus.AMBIGUOUS);

    const { accessToken, refreshToken, jti } =
      await this.tokensService.generateToken(user);

    await this.sessionsService.create({
      ip,
      user_agent: userAgent,
      jti,
      userId: user.id,
    });
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refresh(userId: number, jti: string, ip: string, userAgent: string) {
    const user = await this.usersService.find(userId);
    if (!user) throw new NotFoundException('User not found.');

    const { accessToken, refreshToken, old } = await this.tokensService.refreshToken(
      user,
      jti,
    );

    await this.sessionsService.create({
      jti,
      ip,
      user_agent: userAgent,
      userId: user.id,
    });
    if(old)
      await this.sessionsService.leave(old.jti);
    

    return { user, accessToken, refreshToken };
  }

  async signout(jti: string): Promise<void> {
    await this.tokensService.revokeByJti(jti);
    this.logger.warn('User signed out!');
  }
}
