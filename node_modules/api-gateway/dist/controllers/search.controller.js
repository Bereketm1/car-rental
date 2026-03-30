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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
const proxy_service_1 = require("../services/proxy.service");
let SearchController = class SearchController {
    constructor(proxy) {
        this.proxy = proxy;
    }
    async globalSearch(q) {
        if (!q || q.length < 2) {
            return { success: true, data: { customers: [], vehicles: [], deals: [] } };
        }
        const query = q.toLowerCase();
        // Fetch all for MVP in-memory search across microservices
        const [custRes, vehRes, dealRes] = await Promise.all([
            this.proxy.forward('crm', 'GET', '/customers').catch(() => ({ data: [] })),
            this.proxy.forward('vehicle', 'GET', '/vehicles').catch(() => ({ data: [] })),
            this.proxy.forward('deal', 'GET', '/deals').catch(() => ({ data: [] })),
        ]);
        const customers = (custRes.data || []).filter((c) => (c.firstName || '').toLowerCase().includes(query) ||
            (c.lastName || '').toLowerCase().includes(query) ||
            (c.email || '').toLowerCase().includes(query) ||
            (c.phone || '').includes(query));
        const vehicles = (vehRes.data || []).filter((v) => (v.make || '').toLowerCase().includes(query) ||
            (v.model || '').toLowerCase().includes(query) ||
            (v.trim || '').toLowerCase().includes(query) ||
            (v.condition || '').toLowerCase().includes(query));
        const deals = (dealRes.data || []).filter((d) => (d.customerName || '').toLowerCase().includes(query) ||
            (d.vehicleDescription || '').toLowerCase().includes(query) ||
            (d.stage || '').toLowerCase().includes(query));
        return {
            success: true,
            data: {
                customers,
                vehicles,
                deals
            }
        };
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Global search across all main entities' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "globalSearch", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)('search'),
    (0, common_1.Controller)('api/search'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], SearchController);
