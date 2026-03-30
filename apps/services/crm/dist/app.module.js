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
const customers_controller_1 = require("./customers.controller");
const loan_applications_controller_1 = require("./loan-applications.controller");
const customers_service_1 = require("./customers.service");
const loan_applications_service_1 = require("./loan-applications.service");
const customer_entity_1 = require("./entities/customer.entity");
const vehicle_interest_entity_1 = require("./entities/vehicle-interest.entity");
const loan_application_entity_1 = require("./entities/loan-application.entity");
const document_entity_1 = require("./entities/document.entity");
const notification_entity_1 = require("./entities/notification.entity");
const audit_log_entity_1 = require("./entities/audit-log.entity");
const notifications_service_1 = require("./notifications.service");
const notifications_controller_1 = require("./notifications.controller");
const audit_log_controller_1 = require("./audit-log.controller");
const audit_log_service_1 = require("./audit-log.service");
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
                entities: [customer_entity_1.Customer, vehicle_interest_entity_1.VehicleInterest, loan_application_entity_1.LoanApplication, document_entity_1.Document, notification_entity_1.Notification, audit_log_entity_1.AuditLog],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([customer_entity_1.Customer, vehicle_interest_entity_1.VehicleInterest, loan_application_entity_1.LoanApplication, document_entity_1.Document, notification_entity_1.Notification, audit_log_entity_1.AuditLog]),
        ],
        controllers: [customers_controller_1.CustomersController, loan_applications_controller_1.LoanApplicationsController, notifications_controller_1.NotificationController, audit_log_controller_1.AuditLogController],
        providers: [customers_service_1.CustomersService, loan_applications_service_1.LoanApplicationsService, notifications_service_1.NotificationService, audit_log_service_1.AuditLogService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map