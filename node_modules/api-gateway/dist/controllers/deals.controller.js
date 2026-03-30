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
exports.DealsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
const proxy_service_1 = require("../services/proxy.service");
let DealsController = class DealsController {
    constructor(proxy) {
        this.proxy = proxy;
    }
    findAll(query) {
        return this.proxy.forward('deal', 'GET', '/deals', undefined, query);
    }
    findOne(id) {
        return this.proxy.forward('deal', 'GET', `/deals/${id}`);
    }
    create(body) {
        return this.proxy.forward('deal', 'POST', '/deals', body);
    }
    update(id, body) {
        return this.proxy.forward('deal', 'PUT', `/deals/${id}`, body);
    }
    updateStage(id, body) {
        return this.proxy.forward('deal', 'PUT', `/deals/${id}/stage`, body);
    }
    delete(id) {
        return this.proxy.forward('deal', 'DELETE', `/deals/${id}`);
    }
    getStagesSummary() {
        return this.proxy.forward('deal', 'GET', '/deals/stages/summary');
    }
};
exports.DealsController = DealsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all deals' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DealsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deal by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DealsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new deal' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DealsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update deal' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DealsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/stage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update deal stage' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DealsController.prototype, "updateStage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel deal' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DealsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('stages/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deal stages summary' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DealsController.prototype, "getStagesSummary", null);
exports.DealsController = DealsController = __decorate([
    (0, swagger_1.ApiTags)('deals'),
    (0, common_1.Controller)('api/deals'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], DealsController);
