import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cowsay from 'cowsay';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const docOptions = new DocumentBuilder()
    .setTitle('Blackout API')
    .addBearerAuth()
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, docOptions);
  SwaggerModule.setup(config.get('DOC_URL'), app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
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
