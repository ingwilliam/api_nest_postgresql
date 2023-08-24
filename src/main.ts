import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { EnvConfiguration,ConfigDocumentBuilder } from './config/app.config';
import { LoggerService } from './common/services/logger.service';
import { ValidationExceptionFilter } from './common/helpers/validation-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService() // Creacion de nuestro logger
  });
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

  //Permite tener controlado cualquier exception del sistema
  app.useGlobalFilters(new ValidationExceptionFilter());

  //Documentación del api
  const document = SwaggerModule.createDocument(app, ConfigDocumentBuilder);
  SwaggerModule.setup('api', app, document);

  await app.listen(EnvConfiguration().port);

  logger.log(`Servidor corriendo en el port ${EnvConfiguration().port}`);
}
bootstrap();