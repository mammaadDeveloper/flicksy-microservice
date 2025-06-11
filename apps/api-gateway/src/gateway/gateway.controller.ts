import { createProxyMiddleware } from 'http-proxy-middleware';
import { NextFunction, Request, Response } from 'express';

import { All, Controller, Next, Req, Res } from '@nestjs/common';

@Controller('*')
export class GatewayController {
  @All()
  async handle(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const target = req['targetBaseUrl'];
    if (!target)
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: 'Target not defined',
      });

      // console.log(target);
      

    const proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      timeout: 20000,
      // pathRewrite: {
      //   [`^/api/v1/${req.headers['x-service-name']}`]: '',
      // },
      on: {
        proxyReq: (proxyReq, req) => {
          if (req.headers['x-user-id']) {
            proxyReq.setHeader('x-user-id', req.headers['x-user-id'] as string);
          }
        },
        proxyRes: (proxyRes, req) => {
          console.log(proxyRes);
          
        },
        error: (err, req: Request, res: Response) => {
          console.log(err);
          
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({ error: 'Proxy error', details: err.message }),
          );
        },
      },
    });

    return proxy(req, res, next);
  }
}
