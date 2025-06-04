import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        jti?: string;
    }
}

export const GetUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user;
    return {
        userId: (request.user && (request.user as any).userId) || undefined,
        jti: request.jti || ''
    };
});
