"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Vehicle Service')
        .setDescription('Vehicle Supplier Portal - MerkatoMotors')
        .setVersion('1.0')
        .addTag('vehicles')
        .addTag('suppliers')
        .addTag('inventory')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3002;
    await app.listen(port);
    console.log(`🚗 Vehicle Service running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map