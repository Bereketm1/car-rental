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
const path_1 = require("path");
const typeorm_1 = require("@nestjs/typeorm");
const partners_controller_1 = require("./partners.controller");
const partners_service_1 = require("./partners.service");
const partner_entity_1 = require("./entities/partner.entity");
const commission_entity_1 = require("./entities/commission.entity");
const agreement_entity_1 = require("./entities/agreement.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqljs',
                location: (0, path_1.join)(process.cwd(), 'partner.sqlite'),
                autoSave: true,
                entities: [partner_entity_1.Partner, commission_entity_1.Commission, agreement_entity_1.Agreement],
                synchronize: true, // Warning: true only for dev!
            }),
            typeorm_1.TypeOrmModule.forFeature([partner_entity_1.Partner, commission_entity_1.Commission, agreement_entity_1.Agreement]),
        ],
        controllers: [partners_controller_1.PartnersController],
        providers: [partners_service_1.PartnersService],
    })
], AppModule);
