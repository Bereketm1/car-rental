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
exports.FinancialInstitution = void 0;
const typeorm_1 = require("typeorm");
const loan_review_entity_1 = require("./loan-review.entity");
let FinancialInstitution = class FinancialInstitution {
};
exports.FinancialInstitution = FinancialInstitution;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FinancialInstitution.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FinancialInstitution.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FinancialInstitution.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FinancialInstitution.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_person', nullable: true }),
    __metadata("design:type", String)
], FinancialInstitution.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FinancialInstitution.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FinancialInstitution.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, name: 'interest_rate_min', nullable: true }),
    __metadata("design:type", Number)
], FinancialInstitution.prototype, "interestRateMin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, name: 'interest_rate_max', nullable: true }),
    __metadata("design:type", Number)
], FinancialInstitution.prototype, "interestRateMax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, name: 'interest_rate', nullable: true }),
    __metadata("design:type", Number)
], FinancialInstitution.prototype, "interestRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'max_loan_amount', nullable: true }),
    __metadata("design:type", Number)
], FinancialInstitution.prototype, "maxLoanAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_term', nullable: true }),
    __metadata("design:type", Number)
], FinancialInstitution.prototype, "maxTerm", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], FinancialInstitution.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => loan_review_entity_1.LoanReview, (review) => review.institutionRef),
    __metadata("design:type", Array)
], FinancialInstitution.prototype, "loanReviews", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FinancialInstitution.prototype, "createdAt", void 0);
exports.FinancialInstitution = FinancialInstitution = __decorate([
    (0, typeorm_1.Entity)('financial_institutions')
], FinancialInstitution);
//# sourceMappingURL=financial-institution.entity.js.map