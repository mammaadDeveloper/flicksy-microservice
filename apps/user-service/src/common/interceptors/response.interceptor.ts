import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(map((body) => {
      if(!body || !body.__formatted) return body;

      const {status, message, data, meta, links} = body;

      return {
        statusCode: res.status,
        status: status ?? 'OK',
        success: true,
        message,
        data,
        ...(meta && {meta}),
        ...(links && {links})
      };
    }));
  }
}
