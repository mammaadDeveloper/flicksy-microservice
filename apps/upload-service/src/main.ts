/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    bufferLogs: true,
  });

  // config
  const config = app.get(ConfigService);

  // prefix
  app.setGlobalPrefix('api');

  // versioning
  app.enableVersioning({ type: VersioningType.URI });

  // body parser
  app.use(json());

  // CORS
  app.enableCors();

  // listen
  const port = config.get<number>('app.port') ?? 3000;
  await app.listen(port);
}
bootstrap();
