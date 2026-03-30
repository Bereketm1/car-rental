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
const auth_guard_1 = require("../auth/auth.guard");
const proxy_service_1 = require("../services/proxy.service");
let PartnersController = class PartnersController {
    constructor(proxy) {
        this.proxy = proxy;
    }
    findAll(query) {
        return this.proxy.forward('partner', 'GET', '/partners', undefined, query);
    }
    findOne(id) {
        return this.proxy.forward('partner', 'GET', `/partners/${id}`);
    }
    create(body) {
        return this.proxy.forward('partner', 'POST', '/partners', body);
    }
    update(id, body) {
        return this.proxy.forward('partner', 'PUT', `/partners/${id}`, body);
    }
    delete(id) {
        return this.proxy.forward('partner', 'DELETE', `/partners/${id}`);
    }
    getCommissions(id) {
        return this.proxy.forward('partner', 'GET', `/partners/${id}/commissions`);
    }
    createCommission(id, body) {
        return this.proxy.forward('partner', 'POST', `/partners/${id}/commissions`, body);
    }
    getAgreements(query) {
        return this.proxy.forward('partner', 'GET', '/agreements', undefined, query);
    }
    createAgreement(body) {
        return this.proxy.forward('partner', 'POST', '/agreements', body);
    }
};
exports.PartnersController = PartnersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all partners' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get partner by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new partner' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update partner' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove partner' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':id/commissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get partner commissions' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "getCommissions", null);
__decorate([
    (0, common_1.Post)(':id/commissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Record commission for partner' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "createCommission", null);
__decorate([
    (0, common_1.Get)('agreements/all'),
    (0, swagger_1.ApiOperation)({ summary: 'List all agreements' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "getAgreements", null);
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
    (0, common_1.Controller)('api/partners'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], PartnersController);
