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
exports.LoanApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const loan_application_entity_1 = require("./entities/loan-application.entity");
let LoanApplicationsService = class LoanApplicationsService {
    constructor(applicationRepo) {
        this.applicationRepo = applicationRepo;
    }
    async findAll(query) {
        let where = {};
        if (query?.status) {
            where = { status: query.status };
        }
        const [data, total] = await this.applicationRepo.findAndCount({
            where,
            relations: ['customer', 'documents'],
            order: { createdAt: 'DESC' },
        });
        return { success: true, data, total };
    }
    async findOne(id) {
        const app = await this.applicationRepo.findOne({
            where: { id },
            relations: ['customer', 'documents'],
        });
        if (!app)
            throw new common_1.NotFoundException('Loan application not found');
        return { success: true, data: app };
    }
    async create(dto) {
        const application = this.applicationRepo.create({
            ...dto,
            status: 'submitted',
        });
        const saved = await this.applicationRepo.save(application);
        return { success: true, data: saved, message: 'Loan application submitted' };
    }
    async update(id, dto) {
        const app = await this.applicationRepo.findOne({ where: { id } });
        if (!app)
            throw new common_1.NotFoundException('Loan application not found');
        Object.assign(app, dto);
        const saved = await this.applicationRepo.save(app);
        return { success: true, data: saved };
    }
};
exports.LoanApplicationsService = LoanApplicationsService;
exports.LoanApplicationsService = LoanApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loan_application_entity_1.LoanApplication)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LoanApplicationsService);
//# sourceMappingURL=loan-applications.service.js.map