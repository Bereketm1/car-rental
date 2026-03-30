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
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const finance_controller_1 = require("./finance.controller");
const finance_service_1 = require("./finance.service");
const financial_institution_entity_1 = require("./entities/financial-institution.entity");
const loan_review_entity_1 = require("./entities/loan-review.entity");
const document_request_entity_1 = require("./entities/document-request.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.POSTGRES_HOST || 'localhost',
                port: 5432,
                username: process.env.POSTGRES_USER || 'merkato',
                password: process.env.POSTGRES_PASSWORD || 'merkatopassword',
                database: process.env.POSTGRES_DB || 'merkatomotors',
                entities: [financial_institution_entity_1.FinancialInstitution, loan_review_entity_1.LoanReview, document_request_entity_1.DocumentRequest],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([financial_institution_entity_1.FinancialInstitution, loan_review_entity_1.LoanReview, document_request_entity_1.DocumentRequest]),
        ],
        controllers: [finance_controller_1.FinanceController],
        providers: [finance_service_1.FinanceService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map