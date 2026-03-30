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
exports.LoanApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const loan_applications_service_1 = require("./loan-applications.service");
const dto_1 = require("./dto");
let LoanApplicationsController = class LoanApplicationsController {
    constructor(service) {
        this.service = service;
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
};
exports.LoanApplicationsController = LoanApplicationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all loan applications' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoanApplicationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get loan application by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LoanApplicationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit loan application' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateLoanApplicationDto]),
    __metadata("design:returntype", void 0)
], LoanApplicationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update loan application' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LoanApplicationsController.prototype, "update", null);
exports.LoanApplicationsController = LoanApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('loan-applications'),
    (0, common_1.Controller)('loan-applications'),
    __metadata("design:paramtypes", [loan_applications_service_1.LoanApplicationsService])
], LoanApplicationsController);
//# sourceMappingURL=loan-applications.controller.js.map