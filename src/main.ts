import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as cowsay from 'cowsay';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const config = app.get(ConfigService);

  app.use(express.raw({ type: 'application/webhook+json' }));

  const docOptions = new DocumentBuilder()
    .setTitle('Blackout API')
    .addBearerAuth()
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, docOptions);
  SwaggerModule.setup(config.get('DOC_URL'), app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      transform: true,
      // forbidNonWhitelisted: true,
      // forbidUnknownValues: true,
    }),
  );

  /**
   * Enable cors
   */
  app.enableCors();

  await app.listen(process.env.PORT || 4001);

  console.log(
    cowsay.say({
      text: `Blackout API is running on ${config.get('PORT')}`,
    }),
  );
}
bootstrap();
