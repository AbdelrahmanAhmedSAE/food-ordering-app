import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({ origin: 'http://localhost:3000', credentials: true });

  const config = new DocumentBuilder()
    .setTitle('Food ordering app')
    .setDescription('food ordering app backend api')
    .setVersion('0.1')
    .addTag('food')
    .addCookieAuth('access_token')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      autoTagControllers: true,
    });

  SwaggerModule.setup('api', app, documentFactory, {
    swaggerUrl: 'swagger/ui',
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
    customSiteTitle: 'Food ordering app api',
  });

  await app.listen(process.env.PORT ?? 8000);
}

void bootstrap();
