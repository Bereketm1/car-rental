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
exports.LoanReview = void 0;
const typeorm_1 = require("typeorm");
const financial_institution_entity_1 = require("./financial-institution.entity");
const document_request_entity_1 = require("./document-request.entity");
let LoanReview = class LoanReview {
};
exports.LoanReview = LoanReview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LoanReview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'application_id', nullable: true }),
    __metadata("design:type", String)
], LoanReview.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deal_id', nullable: true }),
    __metadata("design:type", String)
], LoanReview.prototype, "dealId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'institution_id', nullable: true }),
    __metadata("design:type", String)
], LoanReview.prototype, "institutionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => financial_institution_entity_1.FinancialInstitution, (institution) => institution.loanReviews, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'institution_id' }),
    __metadata("design:type", financial_institution_entity_1.FinancialInstitution)
], LoanReview.prototype, "institutionRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LoanReview.prototype, "institution", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', nullable: true }),
    __metadata("design:type", String)
], LoanReview.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_description', nullable: true }),
    __metadata("design:type", String)
], LoanReview.prototype, "vehicleDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reviewer_name', nullable: true }),
    __metadata("design:type", String)
], LoanReview.prototype, "reviewerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], LoanReview.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'requested_amount', nullable: true }),
    __metadata("design:type", Number)
], LoanReview.prototype, "requestedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'approved_amount', nullable: true }),
    __metadata("design:type", Number)
], LoanReview.prototype, "approvedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, name: 'interest_rate', nullable: true }),
    __metadata("design:type", Number)
], LoanReview.prototype, "interestRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], LoanReview.prototype, "term", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'term_months', nullable: true }),
    __metadata("design:type", Number)
], LoanReview.prototype, "termMonths", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LoanReview.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => document_request_entity_1.DocumentRequest, (req) => req.review),
    __metadata("design:type", Array)
], LoanReview.prototype, "documentRequests", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], LoanReview.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], LoanReview.prototype, "updatedAt", void 0);
exports.LoanReview = LoanReview = __decorate([
    (0, typeorm_1.Entity)('loan_reviews')
], LoanReview);
//# sourceMappingURL=loan-review.entity.js.map