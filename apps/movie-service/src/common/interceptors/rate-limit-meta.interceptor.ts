/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { map, Observable, timestamp } from 'rxjs';
import { Response } from 'express';

/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class RateLimitMetaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<Response>();

    const limit =
      parseInt(res.getHeader('X-RateLimit-Limit') as string) || null;
    const remaining =
      parseInt(res.getHeader('X-RateLimit-Remaining') as string) || null;
    const resetUnix =
      parseInt(res.getHeader('X-RateLimit-Reset') as string) || null;

    const reset_at = resetUnix
      ? new Date(resetUnix * 1000).toISOString()
      : null;

    const rateLimitMeta =
      limit !== null && remaining !== null && reset_at !== null
        ? { limit, remaining, reset_at }
        : null;

    return next.handle().pipe(
      map((response) => {
        if (!rateLimitMeta) return response;

        return {
          ...response,
          meta: {
            ...(response.meta || {}),
            rate_limit: rateLimitMeta,
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
