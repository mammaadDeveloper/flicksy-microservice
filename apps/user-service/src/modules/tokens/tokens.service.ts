import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import { v4 as uuidV4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { PersonalAccessEntity } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokensService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PersonalAccessEntity)
    private readonly tokenRepo: Repository<PersonalAccessEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async generateToken(
    user: UserEntity,
    options?: {
      parent?: PersonalAccessEntity;
      // children?: any;
      // type?: 'access' | 'refresh';
      // isRevoked?: boolean;
    },
  ) {
    const jti = uuidV4();

    const accessToken = this.jwtService.sign(
      { sub: user.id },
      { secret: this.configService.get('jwt.secret'),expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, jti },
      { secret: this.configService.get('jwt.refresh.secret'),expiresIn: '30d' },
    );

    await this.tokenRepo.save({
      token: refreshToken,
      user,
      tokenType: 'refresh',
      expiredAt: dayjs().add(30, 'day').toDate(),
      jti,
      parent: options?.parent,
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(
    user: UserEntity,
    jti: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const oldToken = await this.findByJti(jti);

    if(!oldToken)
      throw new NotFoundException('Token not found.')

    const { accessToken, refreshToken } = await this.generateToken(user, {
      parent: oldToken,
    });

    oldToken.isRevoked = true;
    oldToken.lastUsedAt = new Date();
    await this.tokenRepo.save(oldToken);

    return { accessToken, refreshToken };
  }

  async revokeByJti(jti: string): Promise<void>{
    const token = await this.findByJti(jti);

    if(!token)
      throw new NotFoundException('Token not found.');

    token.isRevoked = true;
    this.tokenRepo.save(token);
    return Promise.resolve();
  }

  async findByJti(jti: string) {
    return this.tokenRepo.findOne({ where: { jti, isRevoked: false } });
  }
}
