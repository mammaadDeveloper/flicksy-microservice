import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RegistryService } from './registry/registry.service';
import { Service } from './registry/entities/service.entity';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(private readonly registryService: RegistryService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const targetService = req.headers['x-service-target'];
    const prefix = req.baseUrl.split('/')[1];

    let service: Service;

    if (targetService)
      service = await this.registryService.findByName(targetService as string);
    else service = await this.registryService.findByPrefix(`/${prefix}`);

    if (!service || service.status !== 'healthy')
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        message: 'Service UnAvailable',
      });

    const proxy = createProxyMiddleware({
      target: `http://${service.host}:${service.port}`,
      changeOrigin: true,
      pathRewrite: { [`^/${prefix}`]: '' },
    });
    
    proxy(req, res, next);
  }
}
