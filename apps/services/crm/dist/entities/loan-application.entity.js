"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanApplication = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const document_entity_1 = require("./document.entity");
let LoanApplication = class LoanApplication {
};
exports.LoanApplication = LoanApplication;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LoanApplication.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id' }),
    __metadata("design:type", String)
], LoanApplication.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.loanApplications, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], LoanApplication.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_id' }),
    __metadata("design:type", String)
], LoanApplication.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'requested_amount' }),
    __metadata("design:type", Number)
], LoanApplication.prototype, "requestedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'term_months' }),
    __metadata("design:type", Number)
], LoanApplication.prototype, "termMonths", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'monthly_income' }),
    __metadata("design:type", Number)
], LoanApplication.prototype, "monthlyIncome", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employment_status' }),
    __metadata("design:type", String)
], LoanApplication.prototype, "employmentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'draft' }),
    __metadata("design:type", String)
], LoanApplication.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_entity_1.Document, (doc) => doc.loanApplication),
    __metadata("design:type", Array)
], LoanApplication.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], LoanApplication.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], LoanApplication.prototype, "updatedAt", void 0);
exports.LoanApplication = LoanApplication = __decorate([
    (0, typeorm_1.Entity)('loan_applications')
], LoanApplication);
//# sourceMappingURL=loan-application.entity.js.map