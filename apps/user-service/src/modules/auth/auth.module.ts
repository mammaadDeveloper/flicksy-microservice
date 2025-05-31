import { Module } from '@nestjs/common';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/access.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        UsersModule,
        TokensModule,
        JwtModule.register({})
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
    exports: [AuthService],
})
export class AuthModule {}
