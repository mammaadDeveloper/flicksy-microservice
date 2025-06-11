import { Response } from 'express';

import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from '@nestjs/common';

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    response.status(401).json({
      statusCode: 401,
      status: 'UNAUTHORIZED',
      success: false,
      message: 'Unauthorized access'
    });
  }
}
