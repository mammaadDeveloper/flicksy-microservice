import { Service } from 'src/service/service.service';
import { AuthService } from 'src/auth/auth.service';
import { NextFunction, Request, Response } from 'express';

import {
    BadRequestException, Injectable, NestMiddleware, NotFoundException, ServiceUnavailableException, UnauthorizedException
} from '@nestjs/common';

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
  constructor(
    private readonly service: Service,
    private readonly authService: AuthService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const serviceName =
      (req.headers['x-service-name'] as string) || req.path.split('/')[1];

    if (!serviceName) throw new BadRequestException('Service not specified');

    const service = await this.service.findByName(serviceName);
    if (!service) throw new NotFoundException('Service not found');

    if(service.status == 'down')
      throw new ServiceUnavailableException(`Service ${serviceName} is down`);

    const method = req.method.toUpperCase();
    const fullPath = new URL(req.url, 'http://localhost').pathname.replace(`/${serviceName}`, '').replace('/api', '');

    const routeKey = `${method} ${fullPath}`;

    const needAuth = Array.isArray(service.protectedRoutes) && service.protectedRoutes.includes(routeKey);

    if (needAuth) {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) throw new UnauthorizedException('Missing token');

      try {
        const userId = await this.authService.verifyToken(token);
        req.headers['x-user-id'] = userId;
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    req.url = req.url.replace(`/${serviceName}`, '');
    req['targetBaseUrl'] = service.baseUrl;
    next();
  }
}
