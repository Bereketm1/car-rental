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
exports.PartnersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const partners_service_1 = require("./partners.service");
let PartnersController = class PartnersController {
    constructor(service) {
        this.service = service;
    }
    findAll(query) { return this.service.findAll(query); }
    findOne(id) { return this.service.findOne(id); }
    create(dto) { return this.service.create(dto); }
    update(id, dto) { return this.service.update(id, dto); }
    delete(id) { return this.service.delete(id); }
    getCommissions(id) { return this.service.getCommissions(id); }
    createCommission(id, dto) { return this.service.createCommission(id, dto); }
    findAllAgreements(query) { return this.service.findAllAgreements(query); }
    createAgreement(dto) { return this.service.createAgreement(dto); }
};
exports.PartnersController = PartnersController;
__decorate([
    (0, common_1.Get)('partners'),
    (0, swagger_1.ApiOperation)({ summary: 'List all partners' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('partners/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get partner by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('partners'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new partner' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('partners/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update partner' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('partners/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove partner' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('partners/:id/commissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get partner commissions' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "getCommissions", null);
__decorate([
    (0, common_1.Post)('partners/:id/commissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Record commission' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "createCommission", null);
__decorate([
    (0, common_1.Get)('agreements'),
    (0, swagger_1.ApiOperation)({ summary: 'List all agreements' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "findAllAgreements", null);
__decorate([
    (0, common_1.Post)('agreements'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new agreement' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "createAgreement", null);
exports.PartnersController = PartnersController = __decorate([
    (0, swagger_1.ApiTags)('partners'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [partners_service_1.PartnersService])
], PartnersController);
//# sourceMappingURL=partners.controller.js.map