import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnauthorizedFilter } from './filters/unauthorized.filter';
import { NotFoundExceptionFilter } from './filters/not-found.exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bodyParser: false });

  // const app = await NestFactory.create<NestFastifyApplication>(
  //   AppModule,
  //   new FastifyAdapter({connectionTimeout: 15000}),
  //   { bodyParser: false, cors: false, bufferLogs: true },
  // );

  app.setGlobalPrefix('api');

  app.use(bodyParser.json({ type: '*/*' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
    }),
  );

  app.useGlobalFilters(new UnauthorizedFilter(), new NotFoundExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
