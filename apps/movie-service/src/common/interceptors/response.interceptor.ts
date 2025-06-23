import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((body) => {
        if (!body || !body.__formatted) return body;

        const { status, message, data, meta, links } = body;

        return {
          statusCode: res.statusCode,
          status: status || HttpStatus[res.statusCode],
          success: true,
          message,
          data,
          ...(meta && { meta }),
          ...(links && { links }),
        };
      }),
    );
  }
}
