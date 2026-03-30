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
const finance_service_1 = require("./finance.service");
let FinanceController = class FinanceController {
    constructor(service) {
        this.service = service;
    }
    findAll(query) { return this.service.findAllReviews(query); }
    findOne(id) { return this.service.findOneReview(id); }
    create(dto) { return this.service.createReview(dto); }
    update(id, dto) { return this.service.updateReview(id, dto); }
    approve(id, dto) { return this.service.approveReview(id, dto); }
    reject(id, dto) { return this.service.rejectReview(id, dto); }
    requestDocs(dto) { return this.service.createDocumentRequest(dto); }
    getInstitutions() { return this.service.findAllInstitutions(); }
    createInstitution(dto) { return this.service.createInstitution(dto); }
    getPipeline() { return this.service.getPipeline(); }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'List all loan reviews' }),
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
    (0, swagger_1.ApiOperation)({ summary: 'Update loan review' }),
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
], FinanceController.prototype, "requestDocs", null);
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
    (0, swagger_1.ApiTags)('reviews'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map