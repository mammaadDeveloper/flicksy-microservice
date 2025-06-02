import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConflictExceptionFilter, NotFoundExceptionFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // CORS
  app.enableCors();

  // Filters
  app.useGlobalFilters(new NotFoundExceptionFilter(), new ConflictExceptionFilter());

  await app.listen(config.get('app.port'));
}
bootstrap();
