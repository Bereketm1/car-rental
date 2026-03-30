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
exports.Agreement = void 0;
const typeorm_1 = require("typeorm");
const partner_entity_1 = require("./partner.entity");
let Agreement = class Agreement {
};
exports.Agreement = Agreement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Agreement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'partner_id' }),
    __metadata("design:type", String)
], Agreement.prototype, "partnerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => partner_entity_1.Partner, (partner) => partner.agreements, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'partner_id' }),
    __metadata("design:type", partner_entity_1.Partner)
], Agreement.prototype, "partner", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Agreement.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Agreement.prototype, "terms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date' }),
    __metadata("design:type", Date)
], Agreement.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'date' }),
    __metadata("design:type", Date)
], Agreement.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], Agreement.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Agreement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Agreement.prototype, "updatedAt", void 0);
exports.Agreement = Agreement = __decorate([
    (0, typeorm_1.Entity)('agreements')
], Agreement);
//# sourceMappingURL=agreement.entity.js.map