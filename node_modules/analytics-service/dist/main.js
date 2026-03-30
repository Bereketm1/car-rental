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
    const config = new swagger_1.DocumentBuilder().setTitle('Analytics Service').setDescription('Reporting & Analytics - MerkatoMotors').setVersion('1.0').addTag('analytics').build();
    swagger_1.SwaggerModule.setup('api/docs', app, swagger_1.SwaggerModule.createDocument(app, config));
    const port = process.env.PORT || 3007;
    await app.listen(port);
    console.log(`📊 Analytics Service running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map