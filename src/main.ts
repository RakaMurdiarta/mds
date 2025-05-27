/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from '@app/commons/exceptions/allException';
import { EnvService } from '@app/commons/envs/env.service';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());

  const configService = app.get(EnvService);

  await app.listen(
    configService.get('PORT') ?? 3000,
    configService.get('HOST'),
  );

  app.enableShutdownHooks();
}
bootstrap();
