import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokensService } from "src/modules/tokens/tokens.service";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(private readonly configService: ConfigService,
        private readonly tokenService: TokensService,
        private readonly jwtService: JwtService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('jwt.refresh.secret'),
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

async validate(req: any, payload: any) {
    const tokenRecord = await this.tokenService.findByJti(payload.jti);
    
    if(!tokenRecord || tokenRecord.isRevoked)
        throw new UnauthorizedException('Refresh token is revoked or not found.');

    return {userId: payload.sub, jti: payload.jti };
}
}