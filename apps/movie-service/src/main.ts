import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json } from 'body-parser';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  });

  // Config
  const config = app.get(ConfigService);

  // Prefix
  app.setGlobalPrefix('api');

  // Body Parser
  app.use(json());

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://my-front.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
    credentials: true,
  });

  await app.listen(config.get<number>('app.port'));
}
bootstrap();
