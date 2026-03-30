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
exports.DealsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const deal_entity_1 = require("./entities/deal.entity");
let DealsService = class DealsService {
    constructor(dealRepo) {
        this.dealRepo = dealRepo;
    }
    async findAll(query) {
        let where = {};
        if (query?.stage)
            where.stage = query.stage;
        const [data, total] = await this.dealRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
        });
        return { success: true, data, total };
    }
    async findOne(id) {
        const deal = await this.dealRepo.findOne({ where: { id } });
        if (!deal)
            throw new common_1.NotFoundException('Deal not found');
        return { success: true, data: deal };
    }
    async create(dto) {
        const deal = this.dealRepo.create({
            ...dto,
            stage: dto.stage || 'inquiry',
        });
        const saved = await this.dealRepo.save(deal);
        return { success: true, data: saved, message: 'Deal created' };
    }
    async update(id, dto) {
        const deal = await this.dealRepo.findOne({ where: { id } });
        if (!deal)
            throw new common_1.NotFoundException('Deal not found');
        Object.assign(deal, dto);
        const saved = await this.dealRepo.save(deal);
        return { success: true, data: saved };
    }
    async updateStage(id, dto) {
        return this.update(id, { stage: dto.stage });
    }
    async delete(id) {
        return this.update(id, { stage: 'cancelled' });
    }
    async getStagesSummary() {
        const stages = ['vehicle_selected', 'loan_applied', 'under_review', 'approved', 'contract_signed', 'completed', 'cancelled'];
        const stageCounts = await this.dealRepo
            .createQueryBuilder('deal')
            .select('deal.stage', 'stage')
            .addSelect('COUNT(deal.id)', 'count')
            .groupBy('deal.stage')
            .getRawMany();
        const countsMap = stageCounts.reduce((acc, row) => {
            acc[row.stage] = Number(row.count);
            return acc;
        }, {});
        const summary = stages.map((stage) => ({
            stage,
            count: countsMap[stage] || 0,
        }));
        return { success: true, data: summary };
    }
};
exports.DealsService = DealsService;
exports.DealsService = DealsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(deal_entity_1.Deal)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DealsService);
//# sourceMappingURL=deals.service.js.map