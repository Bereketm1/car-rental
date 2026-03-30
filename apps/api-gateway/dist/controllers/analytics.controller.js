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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
const proxy_service_1 = require("../services/proxy.service");
let AnalyticsController = class AnalyticsController {
    constructor(proxy) {
        this.proxy = proxy;
    }
    getSummary() {
        return this.proxy.forward('analytics', 'GET', '/analytics/summary');
    }
    getSales(query) {
        return this.proxy.forward('analytics', 'GET', '/analytics/sales', undefined, query);
    }
    getFinancing(query) {
        return this.proxy.forward('analytics', 'GET', '/analytics/financing', undefined, query);
    }
    getPartners(query) {
        return this.proxy.forward('analytics', 'GET', '/analytics/partners', undefined, query);
    }
    getRevenue(query) {
        return this.proxy.forward('analytics', 'GET', '/analytics/revenue', undefined, query);
    }
    getTrends(query) {
        return this.proxy.forward('analytics', 'GET', '/analytics/trends', undefined, query);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overall analytics summary' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vehicle sales analytics' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, enum: ['week', 'month', 'quarter', 'year'] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getSales", null);
__decorate([
    (0, common_1.Get)('financing'),
    (0, swagger_1.ApiOperation)({ summary: 'Get financing approval analytics' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getFinancing", null);
__decorate([
    (0, common_1.Get)('partners'),
    (0, swagger_1.ApiOperation)({ summary: 'Get partner performance analytics' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getPartners", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get revenue analytics' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly trends' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getTrends", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('analytics'),
    (0, common_1.Controller)('api/analytics'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], AnalyticsController);
