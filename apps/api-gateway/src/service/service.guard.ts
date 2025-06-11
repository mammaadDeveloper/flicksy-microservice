import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ServiceGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const secret = request.headers['x-service-secret']?.toString().trim();

    if(!secret && secret !== this.configService.get('SECRET_KEY', 'secret-key'))
      throw new ForbiddenException('Access to this section is prohibited.');

    return true;
  }
}
