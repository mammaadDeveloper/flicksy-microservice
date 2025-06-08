import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BadRequestFilter, ConflictExceptionFilter, NotFoundExceptionFilter, ResponseInterceptor, UnauthorizedFilter } from './common';
import { Logger as PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {bufferLogs: true});

  const config = app.get(ConfigService);

  app.useLogger(app.get(PinoLogger));

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
      transform: true,
      // disableErrorMessages: true
    }),
  );

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // CORS
  app.enableCors();

  // Filters
  app.useGlobalFilters(new NotFoundExceptionFilter(), new ConflictExceptionFilter(), new UnauthorizedFilter(), new BadRequestFilter());

  // Serialization
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(config.get('app.port'));
}
bootstrap();
