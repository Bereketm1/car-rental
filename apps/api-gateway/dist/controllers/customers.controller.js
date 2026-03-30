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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const proxy_service_1 = require("../services/proxy.service");
const auth_guard_1 = require("../auth/auth.guard");
let CustomersController = class CustomersController {
    constructor(proxy) {
        this.proxy = proxy;
    }
    findAll(query) {
        return this.proxy.forward('crm', 'GET', '/customers', undefined, query);
    }
    findOne(id) {
        return this.proxy.forward('crm', 'GET', `/customers/${id}`);
    }
    create(body) {
        return this.proxy.forward('crm', 'POST', '/customers', body);
    }
    update(id, body) {
        return this.proxy.forward('crm', 'PUT', `/customers/${id}`, body);
    }
    delete(id) {
        return this.proxy.forward('crm', 'DELETE', `/customers/${id}`);
    }
    addInterest(id, body) {
        return this.proxy.forward('crm', 'POST', `/customers/${id}/interests`, body);
    }
    getInterests(id) {
        return this.proxy.forward('crm', 'GET', `/customers/${id}/interests`);
    }
    addDocument(id, body) {
        return this.proxy.forward('crm', 'POST', `/customers/${id}/documents`, body);
    }
    getDocuments(id) {
        return this.proxy.forward('crm', 'GET', `/customers/${id}/documents`);
    }
    submitLoan(body) {
        return this.proxy.forward('crm', 'POST', '/loan-applications', body);
    }
    getLoanApplications(query) {
        return this.proxy.forward('crm', 'GET', '/loan-applications', undefined, query);
    }
    trackLoan(id) {
        return this.proxy.forward('crm', 'GET', `/loan-applications/${id}`);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all customers' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of customers' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register new customer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Customer created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update customer' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete customer' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/interests'),
    (0, swagger_1.ApiOperation)({ summary: 'Add vehicle interest for customer' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "addInterest", null);
__decorate([
    (0, common_1.Get)(':id/interests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer vehicle interests' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "getInterests", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Attach a document to a customer record' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "addDocument", null);
__decorate([
    (0, common_1.Get)(':id/documents'),
    (0, swagger_1.ApiOperation)({ summary: 'List documents attached to a customer record' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Post)('loan-applications'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit loan application' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "submitLoan", null);
__decorate([
    (0, common_1.Get)('loan-applications/all'),
    (0, swagger_1.ApiOperation)({ summary: 'List all loan applications' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "getLoanApplications", null);
__decorate([
    (0, common_1.Get)('loan-applications/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Track loan application' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "trackLoan", null);
exports.CustomersController = CustomersController = __decorate([
    (0, swagger_1.ApiTags)('customers'),
    (0, common_1.Controller)('api/customers'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], CustomersController);
