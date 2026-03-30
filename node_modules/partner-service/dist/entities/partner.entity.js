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
exports.Partner = void 0;
const typeorm_1 = require("typeorm");
const commission_entity_1 = require("./commission.entity");
const agreement_entity_1 = require("./agreement.entity");
let Partner = class Partner {
};
exports.Partner = Partner;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Partner.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Partner.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'entity_id', nullable: true }),
    __metadata("design:type", String)
], Partner.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Partner.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Partner.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Partner.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Partner.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, name: 'commission_rate', nullable: true }),
    __metadata("design:type", Number)
], Partner.prototype, "commissionRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], Partner.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => commission_entity_1.Commission, (commission) => commission.partner),
    __metadata("design:type", Array)
], Partner.prototype, "commissions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => agreement_entity_1.Agreement, (agreement) => agreement.partner),
    __metadata("design:type", Array)
], Partner.prototype, "agreements", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Partner.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Partner.prototype, "updatedAt", void 0);
exports.Partner = Partner = __decorate([
    (0, typeorm_1.Entity)('partners')
], Partner);
//# sourceMappingURL=partner.entity.js.map