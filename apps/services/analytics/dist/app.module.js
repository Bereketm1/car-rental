"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const analytics_controller_1 = require("./analytics.controller");
const analytics_service_1 = require("./analytics.service");
const analytics_snapshot_entity_1 = require("./entities/analytics-snapshot.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.POSTGRES_HOST || 'localhost',
                port: 5432,
                username: process.env.POSTGRES_USER || 'merkato',
                password: process.env.POSTGRES_PASSWORD || 'merkatopassword',
                database: process.env.POSTGRES_DB || 'merkatomotors',
                entities: [analytics_snapshot_entity_1.AnalyticsSnapshot],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([analytics_snapshot_entity_1.AnalyticsSnapshot]),
        ],
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [analytics_service_1.AnalyticsService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map