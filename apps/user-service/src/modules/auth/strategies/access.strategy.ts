import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/modules/users/users.service";
import { GetUserType } from "src/shared/types/user.type";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access'){
    constructor(configService: ConfigService, private readonly userService: UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('jwt.secret'),
            passReqToCallback: false,
            ignoreExpiration: false,
        });
    }
    async validate(payload: any): Promise<GetUserType> {
        const user = await this.userService.find(payload.sub);

        if(!user)
            throw new UnauthorizedException({message: 'Unauthorized', error: 'User not found'});

        return {id: payload.sub, user};
    }

}