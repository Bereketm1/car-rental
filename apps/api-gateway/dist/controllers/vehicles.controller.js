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
exports.VehiclesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
const proxy_service_1 = require("../services/proxy.service");
let VehiclesController = class VehiclesController {
    constructor(proxy) {
        this.proxy = proxy;
    }
    findAll(query) {
        return this.proxy.forward('vehicle', 'GET', '/vehicles', undefined, query);
    }
    findOne(id) {
        return this.proxy.forward('vehicle', 'GET', `/vehicles/${id}`);
    }
    create(body) {
        return this.proxy.forward('vehicle', 'POST', '/vehicles', body);
    }
    update(id, body) {
        return this.proxy.forward('vehicle', 'PUT', `/vehicles/${id}`, body);
    }
    delete(id) {
        return this.proxy.forward('vehicle', 'DELETE', `/vehicles/${id}`);
    }
    getSuppliers(query) {
        return this.proxy.forward('vehicle', 'GET', '/suppliers', undefined, query);
    }
    createSupplier(body) {
        return this.proxy.forward('vehicle', 'POST', '/suppliers', body);
    }
    getInventory() {
        return this.proxy.forward('vehicle', 'GET', '/inventory/summary');
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all vehicles' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'make', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'condition', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of vehicles' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vehicle by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register new vehicle' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vehicle registered' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update vehicle details' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete vehicle' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('suppliers/all'),
    (0, swagger_1.ApiOperation)({ summary: 'List all suppliers' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "getSuppliers", null);
__decorate([
    (0, common_1.Post)('suppliers'),
    (0, swagger_1.ApiOperation)({ summary: 'Register new supplier' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "createSupplier", null);
__decorate([
    (0, common_1.Get)('inventory/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory summary' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "getInventory", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, swagger_1.ApiTags)('vehicles'),
    (0, common_1.Controller)('api/vehicles'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], VehiclesController);
