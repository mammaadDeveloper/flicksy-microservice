import { AppLoggerService, ValidateTokenRequest, ValidateTokenResponse } from 'src/shared';

import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Controller } from '@nestjs/common';
import { status } from '@grpc/grpc-js';

import { UsersService } from '../users/users.service';

@Controller()
export class GrpcController{
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UsersService,
        private readonly logger: AppLoggerService
    ){
        logger.setContext(GrpcController.name);
    }

    @GrpcMethod('UserService', 'VerifyToken')
    async validateToken(data: ValidateTokenRequest): Promise<ValidateTokenResponse>{
        try{
            const token = this.jwtService.verify(data.token, {secret: this.configService.get('jwt.secret')});

            const user = await this.userService.find(token.sub);

            if(!user)
                throw 'Invalid user';

            this.logger.log('Token verified by grpc method successfully');

            return {
                userId: user?.id || null
            };
        }
        catch(err){
            this.logger.error('Failed to verify token by grpc method', err);
            throw new RpcException({message: err || 'Unknown error', code: status.INTERNAL});
        }
    }
}