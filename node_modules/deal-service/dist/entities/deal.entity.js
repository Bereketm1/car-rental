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
exports.Deal = void 0;
const typeorm_1 = require("typeorm");
let Deal = class Deal {
};
exports.Deal = Deal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Deal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id', nullable: true }),
    __metadata("design:type", String)
], Deal.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name', nullable: true }),
    __metadata("design:type", String)
], Deal.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_id', nullable: true }),
    __metadata("design:type", String)
], Deal.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_description', nullable: true }),
    __metadata("design:type", String)
], Deal.prototype, "vehicleDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'application_id', nullable: true }),
    __metadata("design:type", String)
], Deal.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'review_id', nullable: true }),
    __metadata("design:type", String)
], Deal.prototype, "reviewId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'inquiry' }),
    __metadata("design:type", String)
], Deal.prototype, "stage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Deal.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount', nullable: true }),
    __metadata("design:type", Number)
], Deal.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'down_payment', nullable: true }),
    __metadata("design:type", Number)
], Deal.prototype, "downPayment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, name: 'financed_amount', nullable: true }),
    __metadata("design:type", Number)
], Deal.prototype, "financedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Deal.prototype, "commission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Deal.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Deal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Deal.prototype, "updatedAt", void 0);
exports.Deal = Deal = __decorate([
    (0, typeorm_1.Entity)('deals')
], Deal);
//# sourceMappingURL=deal.entity.js.map