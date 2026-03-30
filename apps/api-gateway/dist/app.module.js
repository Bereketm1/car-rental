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
const core_1 = require("@nestjs/core");
const axios_1 = require("@nestjs/axios");
const customers_controller_1 = require("./controllers/customers.controller");
const vehicles_controller_1 = require("./controllers/vehicles.controller");
const finance_controller_1 = require("./controllers/finance.controller");
const deals_controller_1 = require("./controllers/deals.controller");
const partners_controller_1 = require("./controllers/partners.controller");
const leads_controller_1 = require("./controllers/leads.controller");
const analytics_controller_1 = require("./controllers/analytics.controller");
const search_controller_1 = require("./controllers/search.controller");
const documents_controller_1 = require("./controllers/documents.controller");
const notifications_controller_1 = require("./controllers/notifications.controller");
const audit_logs_controller_1 = require("./controllers/audit-logs.controller");
const proxy_service_1 = require("./services/proxy.service");
const auth_module_1 = require("./auth/auth.module");
const audit_interceptor_1 = require("./interceptors/audit.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            auth_module_1.AuthModule,
        ],
        controllers: [
            customers_controller_1.CustomersController,
            vehicles_controller_1.VehiclesController,
            finance_controller_1.FinanceController,
            deals_controller_1.DealsController,
            partners_controller_1.PartnersController,
            leads_controller_1.LeadsController,
            analytics_controller_1.AnalyticsController,
            search_controller_1.SearchController,
            documents_controller_1.DocumentsController,
            notifications_controller_1.NotificationsController,
            audit_logs_controller_1.AuditLogsController,
        ],
        providers: [
            proxy_service_1.ProxyService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_interceptor_1.AuditInterceptor,
            },
        ],
    })
], AppModule);
