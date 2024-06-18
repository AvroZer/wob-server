import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('world-of-baikal');
  app.enableCors();
  app.use('/world-of-baikal/gallery', express.static(join(__dirname, '..', 'gallery')));
  app.use('/world-of-baikal/news', express.static(join(__dirname, '..', 'news-images')));

  const config = new DocumentBuilder()
    .setTitle('World of Baikal')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
