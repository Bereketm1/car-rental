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
exports.Lead = void 0;
const typeorm_1 = require("typeorm");
const campaign_entity_1 = require("./campaign.entity");
let Lead = class Lead {
};
exports.Lead = Lead;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Lead.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campaign_id', nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "campaignId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => campaign_entity_1.Campaign, (campaign) => campaign.leads, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'campaign_id' }),
    __metadata("design:type", campaign_entity_1.Campaign)
], Lead.prototype, "campaign", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'new' }),
    __metadata("design:type", String)
], Lead.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_interest', nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "vehicleInterest", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Lead.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Lead.prototype, "updatedAt", void 0);
exports.Lead = Lead = __decorate([
    (0, typeorm_1.Entity)('leads')
], Lead);
//# sourceMappingURL=lead.entity.js.map