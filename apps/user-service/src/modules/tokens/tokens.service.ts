import { Injectable, NotFoundException } from '@nestjs/common';
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
    @InjectRepository(PersonalAccessEntity)
    private readonly tokenRepo: Repository<PersonalAccessEntity>,
    private readonly jwtService: JwtService,
    private readonly repository: TokenRepositoryService,
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
      { secret: this.configService.get('jwt.secret'), expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, jti },
      {
        secret: this.configService.get('jwt.refresh.secret'),
        expiresIn: '30d',
      },
    );

    await this.repository.create({
      token: refreshToken,
      user,
      expiredAt: dayjs().add(30, 'day').toDate(),
      jti,
      type: 'refresh',
      parent: options?.parent
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(
    user: UserEntity,
    jti: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const oldToken = await this.repository.revoke(jti);

    const { accessToken, refreshToken } = await this.generateToken(user, {
      parent: oldToken,
    });

    return { accessToken, refreshToken };
  }

  async revokeByJti(jti: string): Promise<void> {
    await this.repository.revoke(jti);
    return Promise.resolve();
  }

  async findByJti(jti: string): Promise<PersonalAccessEntity>{
    return await this.repository.findByJti(jti);
  }
}
