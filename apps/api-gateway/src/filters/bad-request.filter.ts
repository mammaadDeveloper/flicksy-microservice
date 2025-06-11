import { Response } from 'express';

import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const res = exception.getResponse() as
      | string
      | { message: string; error?: string; statusCode?: number };

    const defaultMessage =
      'The submitted request is invalid. Please check the input values.';

    const message =
      typeof res === 'string'
        ? res !== 'Bad Request'
          ? res
          : defaultMessage
        : res.message && res.message !== 'Bad Request'
          ? res.message
          : defaultMessage;
    const error = typeof res === 'string' ? null : res.error;

    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      status: 'BAD REQUEST',
      success: false,
      message:
        message !== 'Bad Request'
          ? message
          : 'The submitted request is invalid. Please check the input values.',
      error,
    });
  }
}
