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
const leads_controller_1 = require("./leads.controller");
const leads_service_1 = require("./leads.service");
const lead_entity_1 = require("./entities/lead.entity");
const campaign_entity_1 = require("./entities/campaign.entity");
const referral_entity_1 = require("./entities/referral.entity");
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
                entities: [lead_entity_1.Lead, campaign_entity_1.Campaign, referral_entity_1.Referral],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([lead_entity_1.Lead, campaign_entity_1.Campaign, referral_entity_1.Referral]),
        ],
        controllers: [leads_controller_1.LeadsController],
        providers: [leads_service_1.LeadsService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map