import { ServiceModule } from 'src/service/service.module';
import { AuthModule } from 'src/auth/auth.module';

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { GatewayMiddleware } from './gateway.middleware';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [ServiceModule, AuthModule],
  controllers: [GatewayController],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GatewayMiddleware)
      .exclude({ path: 'services', method: RequestMethod.ALL })
      .forRoutes(GatewayController);
  }
}
