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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
const proxy_service_1 = require("../services/proxy.service");
let FinanceController = class FinanceController {
    constructor(proxy) {
        this.proxy = proxy;
    }
    findAll(query) {
        return this.proxy.forward('finance', 'GET', '/reviews', undefined, query);
    }
    findOne(id) {
        return this.proxy.forward('finance', 'GET', `/reviews/${id}`);
    }
    create(body) {
        return this.proxy.forward('finance', 'POST', '/reviews', body);
    }
    update(id, body) {
        return this.proxy.forward('finance', 'PUT', `/reviews/${id}`, body);
    }
    approve(id, body) {
        return this.proxy.forward('finance', 'POST', `/reviews/${id}/approve`, body);
    }
    reject(id, body) {
        return this.proxy.forward('finance', 'POST', `/reviews/${id}/reject`, body);
    }
    requestDocuments(body) {
        return this.proxy.forward('finance', 'POST', '/document-requests', body);
    }
    getInstitutions() {
        return this.proxy.forward('finance', 'GET', '/institutions');
    }
    createInstitution(body) {
        return this.proxy.forward('finance', 'POST', '/institutions', body);
    }
    getPipeline() {
        return this.proxy.forward('finance', 'GET', '/pipeline');
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'List all loan reviews' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of loan reviews' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('reviews/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get loan review by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Create loan review' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('reviews/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update loan review status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('reviews/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve financing' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)('reviews/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject financing' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)('document-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Request additional documents' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "requestDocuments", null);
__decorate([
    (0, common_1.Get)('institutions'),
    (0, swagger_1.ApiOperation)({ summary: 'List financial institutions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getInstitutions", null);
__decorate([
    (0, common_1.Post)('institutions'),
    (0, swagger_1.ApiOperation)({ summary: 'Register financial institution' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createInstitution", null);
__decorate([
    (0, common_1.Get)('pipeline'),
    (0, swagger_1.ApiOperation)({ summary: 'Get loan pipeline overview' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getPipeline", null);
exports.FinanceController = FinanceController = __decorate([
    (0, swagger_1.ApiTags)('finance'),
    (0, common_1.Controller)('api/finance'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], FinanceController);
