import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();

    response.status(404).json({
      statusCode: 404,
      status: 'NOt FOUND',
      success: false,
      message: exception.message
    });
  }
}
