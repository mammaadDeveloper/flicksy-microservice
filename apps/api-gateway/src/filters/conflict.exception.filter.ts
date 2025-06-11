import { Response } from 'express';

import {
    ArgumentsHost, Catch, ConflictException, ExceptionFilter, HttpStatus
} from '@nestjs/common';

@Catch(ConflictException)
export class ConflictExceptionFilter implements ExceptionFilter {
  catch(exception: ConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    

    if (exception instanceof ConflictException) {
      const status = exception.getStatus?.() ?? HttpStatus.CONFLICT;
      const res: any = exception.getResponse?.();

      const message = typeof res === 'string' ? res : res?.message ?? 'Conflict';

      response.status(status).json({
        statusCode: status,
        error: res?.error ?? 'Conflict',
        success: false,
        message,
      });
    } else {
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        status: 'CONFLICT',
        success: false,
        message: 'Conflict error occurred',
      });
    }
  }
}
