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
exports.Campaign = void 0;
const typeorm_1 = require("typeorm");
const lead_entity_1 = require("./lead.entity");
let Campaign = class Campaign {
};
exports.Campaign = Campaign;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Campaign.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Campaign.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Campaign.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Campaign.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Campaign.prototype, "spent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Campaign.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Campaign.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Campaign.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'draft' }),
    __metadata("design:type", String)
], Campaign.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'leads_generated', default: 0 }),
    __metadata("design:type", Number)
], Campaign.prototype, "leadsGenerated", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Campaign.prototype, "conversions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lead_entity_1.Lead, (lead) => lead.campaign),
    __metadata("design:type", Array)
], Campaign.prototype, "leads", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Campaign.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Campaign.prototype, "updatedAt", void 0);
exports.Campaign = Campaign = __decorate([
    (0, typeorm_1.Entity)('campaigns')
], Campaign);
//# sourceMappingURL=campaign.entity.js.map