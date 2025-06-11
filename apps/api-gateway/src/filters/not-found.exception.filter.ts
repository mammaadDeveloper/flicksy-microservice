import { Response } from 'express';

import {
    ArgumentsHost, Catch, ExceptionFilter, HttpStatus, NotFoundException
} from '@nestjs/common';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof NotFoundException) {
      const status = exception.getStatus?.() ?? HttpStatus.NOT_FOUND;
      const res: any = exception.getResponse?.();

      const message =
        typeof res === 'string' ? res : (res?.message ?? 'Not found');

      response.status(status).json({
        statusCode: status,
        error: 'NOT FOUND',
        success: false,
        message,
      });
    }else
      response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'NOT FOUND',
        success: false,
        message: 'Not found error occurred'
      });
  }
}
