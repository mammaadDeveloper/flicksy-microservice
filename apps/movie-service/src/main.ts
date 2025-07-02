/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json } from 'body-parser';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';
import { RateLimitMetaInterceptor, ResponseInterceptor } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  });

  // Config
  const config = app.get(ConfigService);

  // Prefix
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // Body Parser
  app.use(json());

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Logger
  const logger = app.get(PinoLogger);
  app.useLogger(logger);

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://my-front.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
    credentials: true,
  });

  // Interceptor
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new RateLimitMetaInterceptor(),
  );

  const port = config.get<number>('app.port') ?? 3000;
  await app.listen(port);

  logger.log(`Application started on port: ${port}`);
}
bootstrap();
