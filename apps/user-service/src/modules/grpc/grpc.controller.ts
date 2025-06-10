import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { JwtService } from '@nestjs/jwt';
import { TokensService } from "../tokens/tokens.service";
import { UsersService } from "../users/users.service";
import { ValidateTokenRequest, ValidateTokenResponse } from "src/shared";

@Controller()
export class GrpcController{
    constructor(
        private readonly jwt: JwtService,
        private readonly token: TokensService,
        private readonly user: UsersService
    ){}

    @GrpcMethod('UsersService', 'ValidateToken')
    async validateToken(data: ValidateTokenRequest, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<ValidateTokenResponse>{
        // verify token
        this.jwt.verify(data.access_token);
        // verify token on database
        // verify user
        console.log('data', data);
        console.log('metadata', metadata.getMap());
        await new Promise((resolve) => setTimeout(resolve, 2_000));
        console.log('peer', call.getPath());
        return {
            id: 0,
            jti: ''
        };
    }
}