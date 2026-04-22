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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commission = void 0;
const typeorm_1 = require("typeorm");
const partner_entity_1 = require("./partner.entity");
let Commission = class Commission {
};
exports.Commission = Commission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Commission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'partner_id' }),
    __metadata("design:type", String)
], Commission.prototype, "partnerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => partner_entity_1.Partner, (partner) => partner.commissions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'partner_id' }),
    __metadata("design:type", typeof (_a = typeof partner_entity_1.Partner !== "undefined" && partner_entity_1.Partner) === "function" ? _a : Object)
], Commission.prototype, "partner", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deal_id' }),
    __metadata("design:type", String)
], Commission.prototype, "dealId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Commission.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Commission.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Commission.prototype, "paidAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Commission.prototype, "createdAt", void 0);
exports.Commission = Commission = __decorate([
    (0, typeorm_1.Entity)('commissions')
], Commission);
