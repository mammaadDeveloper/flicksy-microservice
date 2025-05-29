import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokensService } from "src/modules/tokens/tokens.service";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(configService: ConfigService,
        private readonly tokenService: TokensService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('jwt.refresh.secret'),
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    async validate(payload: any) {
        const token = await this.tokenService.findByJti(payload.jti);
        
        if(!token || token.isRevoked)
            throw new UnauthorizedException('Refresh token is revoked or not found.');

        return {userId: payload.sub, jti: payload.jti };
    }
}