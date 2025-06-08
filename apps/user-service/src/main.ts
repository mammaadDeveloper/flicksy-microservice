import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestFilter,
  ConflictExceptionFilter,
  NotFoundExceptionFilter,
  ResponseInterceptor,
  UnauthorizedFilter,
} from './common';
import { Logger as PinoLogger } from 'nestjs-pino';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = app.get(ConfigService);

  app.useLogger(app.get(PinoLogger));

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
      transform: true,
    }),
  );

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

  // Helmet
  if (process.env.NODE_ENV === 'production')
    app.use(
      helmet({
        hidePoweredBy: true,
        xssFilter: true,
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
              "'self'",
              "'unsafe-inline'",
              'https://cdn.jsdelivr.net',
              'https://cdnjs.cloudflare.com',
              'https://www.google-analytics.com',
              'https://www.googletagmanager.com',
            ],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              'https://fonts.googleapis.com',
              'https://cdn.jsdelivr.net',
            ],
            fontSrc: [
              "'self'",
              'https://fonts.gstatic.com',
              'https://cdn.jsdelivr.net',
            ],
            imgSrc: [
              "'self'",
              'data:',
              'blob:',
              'https://res.cloudinary.com',
              'https://images.unsplash.com',
              'https://cdn.example.com',
            ],
            connectSrc: [
              "'self'",
              'https://api.example.com',
              'wss://example.com',
              'https://vercel.live',
            ],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
          },
        },
        referrerPolicy: {
          policy: 'no-referrer',
        },
        noSniff: true,
        dnsPrefetchControl: {
          allow: false,
        },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: 'same-origin' },
        permittedCrossDomainPolicies: { permittedPolicies: 'none' },
        hsts: {
          maxAge: 31536000, // یک سال
          includeSubDomains: true,
          preload: true,
        },
      }),
    );

  // Filters
  app.useGlobalFilters(
    new NotFoundExceptionFilter(),
    new ConflictExceptionFilter(),
    new UnauthorizedFilter(),
    new BadRequestFilter(),
  );

  // Serialization
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(config.get('app.port'));
}
bootstrap();
