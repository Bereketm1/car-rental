"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(3000);
    console.log('🚀 API Gateway running on http://localhost:3000');
    console.log('📚 Swagger docs at http://localhost:3000/api/docs');
    console.log('🔄 Live reload triggered');
}
bootstrap();
