import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = new DocumentBuilder().setTitle('Lead Service').setDescription('Lead Generation & Marketing - MerkatoMotors').setVersion('1.0').addTag('leads').addTag('campaigns').addTag('referrals').build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));
  const port = process.env.PORT || 3006;
  await app.listen(port);
  console.log(`📣 Lead Service running on http://localhost:${port}`);
}
bootstrap();
