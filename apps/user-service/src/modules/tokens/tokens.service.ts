import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import { v4 as uuidV4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { PersonalAccessEntity } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import { TokenRepositoryService } from './services/repository.service';

@Injectable()
export class TokensService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly repository: TokenRepositoryService,
  ) {}
  async generateToken(
    user: UserEntity,
    options?: {
      parent?: PersonalAccessEntity;
    },
  ) {
    const jti = uuidV4();

    const accessToken = this.generateAccessToken(user.id);

    const refreshToken = this.generateRefreshToken(user.id, jti);

    await this.repository.create({
      token: refreshToken,
      user,
      expiredAt: dayjs().add(30, 'day').toDate(),
      jti,
      type: 'refresh',
      parent: options?.parent,
    });

    return { accessToken, refreshToken, jti };
  }

  async refreshToken(
    user: UserEntity,
    jti: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    old: PersonalAccessEntity;
  }> {
    const oldToken = await this.repository.findByUser(user.id);

    if (oldToken.expiredAt > new Date()) {
      const accessToken = this.generateAccessToken(user.id);

      return { accessToken, refreshToken: '', old: oldToken };
    }

    await this.repository.revoke(jti);

    const { accessToken, refreshToken } = await this.generateToken(user, {
      parent: oldToken,
    });

    return { accessToken, refreshToken, old: oldToken };
  }

  async revokeByJti(jti: string): Promise<void> {
    await this.repository.revoke(jti);
  }

  async findByJti(jti: string): Promise<PersonalAccessEntity> {
    if (!jti) throw new UnauthorizedException('Invalid refresh token');

    const token = await this.repository.findByJti(jti);

    if (!token)
      throw new UnauthorizedException('Invalid refresh token or not found');

    return token;
  }

  generateAccessToken(userId: number): string {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expiresAt'),
      },
    );
  }

  generateRefreshToken(userId: number, jti: string) {
    return this.jwtService.sign(
      { sub: userId, jti },
      {
        secret: this.configService.get('jwt.refresh.secret'),
        expiresIn: this.configService.get('jwt.refresh.expiresAt'),
      },
    );
  }
}
