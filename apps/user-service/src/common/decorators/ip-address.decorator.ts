import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const IpAddress = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.headers['x-forwarded-for'] || request.socket?.remoteAddress || request.ip;
    return ip;
});
