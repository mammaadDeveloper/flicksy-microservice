import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokensService } from "src/modules/tokens/tokens.service";
import { JwtService } from '@nestjs/jwt';
import { GetUserType } from "src/shared/types/user.type";

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
        });
    }

async validate(payload: any): Promise<GetUserType> {
    const tokenRecord = await this.tokenService.findByJti(payload.jti);
    
    if(!tokenRecord || tokenRecord.isRevoked)
        throw new UnauthorizedException('Refresh token is revoked or not found.');

    return {id: payload.sub, jti: payload.jti, user: tokenRecord.user };
}
}