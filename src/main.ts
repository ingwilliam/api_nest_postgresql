import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { EnvConfiguration,ConfigDocumentBuilder } from './config/app.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger  = new Logger('Booststrap');

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  //Permite hacer las validaciones globales para los DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const document = SwaggerModule.createDocument(app, ConfigDocumentBuilder);

  SwaggerModule.setup('api', app, document);

  await app.listen(EnvConfiguration().port);

  logger.log(`Servidor corriendo en el port ${EnvConfiguration().port}`);
}
bootstrap();
