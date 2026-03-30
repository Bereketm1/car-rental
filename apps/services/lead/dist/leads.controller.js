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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leads_service_1 = require("./leads.service");
let LeadsController = class LeadsController {
    constructor(service) {
        this.service = service;
    }
    findAll(query) { return this.service.findAllLeads(query); }
    findOne(id) { return this.service.findOneLead(id); }
    create(dto) { return this.service.createLead(dto); }
    update(id, dto) { return this.service.updateLead(id, dto); }
    delete(id) { return this.service.deleteLead(id); }
    getCampaigns(query) { return this.service.findAllCampaigns(query); }
    createCampaign(dto) { return this.service.createCampaign(dto); }
    updateCampaign(id, dto) { return this.service.updateCampaign(id, dto); }
    getReferrals(query) { return this.service.findAllReferrals(query); }
    createReferral(dto) { return this.service.createReferral(dto); }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Get)('leads'),
    (0, swagger_1.ApiOperation)({ summary: 'List all leads' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('leads/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lead by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('leads'),
    (0, swagger_1.ApiOperation)({ summary: 'Capture new lead' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('leads/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lead' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('leads/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete lead' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('campaigns'),
    (0, swagger_1.ApiOperation)({ summary: 'List all campaigns' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "getCampaigns", null);
__decorate([
    (0, common_1.Post)('campaigns'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new campaign' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.Put)('campaigns/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update campaign' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "updateCampaign", null);
__decorate([
    (0, common_1.Get)('referrals'),
    (0, swagger_1.ApiOperation)({ summary: 'List all referrals' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "getReferrals", null);
__decorate([
    (0, common_1.Post)('referrals'),
    (0, swagger_1.ApiOperation)({ summary: 'Create referral' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "createReferral", null);
exports.LeadsController = LeadsController = __decorate([
    (0, swagger_1.ApiTags)('leads'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [leads_service_1.LeadsService])
], LeadsController);
//# sourceMappingURL=leads.controller.js.map