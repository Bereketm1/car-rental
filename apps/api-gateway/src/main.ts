import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('MerkatoMotors API')
    .setDescription('Vehicle Financing Marketplace Platform API Gateway')
    .setVersion('1.0')
    .addTag('customers', 'Customer Management')
    .addTag('vehicles', 'Vehicle Management')
    .addTag('finance', 'Financial Services')
    .addTag('deals', 'Deal Management')
    .addTag('partners', 'Partnership Management')
    .addTag('leads', 'Lead Generation & Marketing')
    .addTag('analytics', 'Reporting & Analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('🚀 API Gateway running on http://localhost:3000');
  console.log('📚 Swagger docs at http://localhost:3000/api/docs');
  console.log('🔄 Live reload triggered');
}
bootstrap();
