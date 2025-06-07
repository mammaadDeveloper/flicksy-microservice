import { Expose, Transform } from "class-transformer";
import { IsBoolean, IsIP, IsOptional, IsUUID } from "class-validator";

export class SessionQueryDto{
    @IsOptional()
    @IsUUID()
    id?: string;

    @Expose({name: 'token'})
    @IsOptional()
    @IsUUID()
    jti?: string;

    @Expose({name: 'ip'})
    @IsOptional()
    @IsIP()
    ipAddress?: string;

    @Expose({name:'user_agent'})
    @IsOptional()
    userAgent?: string;

    @Expose({name: 'active'})
    @IsOptional()
    @IsBoolean()
    @Transform((value) => !value, {toClassOnly: true})
    isRevoked?: boolean;
}