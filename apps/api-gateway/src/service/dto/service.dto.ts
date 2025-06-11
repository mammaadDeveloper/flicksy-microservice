import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateServiceDto{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsUrl({
        require_protocol: true,
        protocols: ['http', 'https'],
        allow_underscores: true,
        allow_trailing_dot: false,
        require_tld: false,
        host_whitelist: [/^localhost(:\d+)?$/, /^[a-zA-Z0-9.-]+$/]
    })
    url: string;

    @IsOptional()
    @IsBoolean()
    protect: boolean;
}