import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const allowedOrigins: string =
    process.env.FRONTEND_URL ?? 'http://localhost:3000';

  app.enableCors({ origin: allowedOrigins, credentials: true });

  const config = new DocumentBuilder()
    .setTitle('Food ordering app')
    .setDescription('food ordering app backend api')
    .setVersion('0.1')
    .addTag('food')
    .addCookieAuth('access_token')
    .build();

  const documentFactory = (): OpenAPIObject => {
    const doc: OpenAPIObject = SwaggerModule.createDocument(app, config, {
      autoTagControllers: true,
    });

    return cleanupOpenApiDoc(doc);
  };

  SwaggerModule.setup('api', app, documentFactory, {
    swaggerUrl: 'swagger/ui',
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
    customSiteTitle: 'Food ordering app api',
  });

  await app.listen(process.env.PORT ?? 8000);
}

void bootstrap();
