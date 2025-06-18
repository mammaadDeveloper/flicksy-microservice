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
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { bufferLogs: true, bodyParser: false });

  // Config
  const config = app.get(ConfigService);

  // Prefix
  app.setGlobalPrefix('api');

  // Body parser
  app.use(bodyParser.json({type: 'application/json'}))
  
  // Logger
  const logger = app.get(PinoLogger);
  app.useLogger(logger);

  // Microservices
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: config.get('grpc.package'),
      protoPath: join(__dirname, 'proto', config.get('grpc.proto')),
      url: config.get('grpc.url')
    }
  });
  await app.startAllMicroservices();


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

  await app.listen(config.get<number>('app.port'));
  logger.log(`Application started on port: ${config.get('app.port')}`);
  logger.log(`Application grpc started on: ${config.get('grpc.url')}`);
}
bootstrap();
