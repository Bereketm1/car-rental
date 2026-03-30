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
exports.PartnersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const partner_entity_1 = require("./entities/partner.entity");
const commission_entity_1 = require("./entities/commission.entity");
const agreement_entity_1 = require("./entities/agreement.entity");
let PartnersService = class PartnersService {
    constructor(partnerRepo, commissionRepo, agreementRepo) {
        this.partnerRepo = partnerRepo;
        this.commissionRepo = commissionRepo;
        this.agreementRepo = agreementRepo;
    }
    async findAll(query) {
        const [data, total] = await this.partnerRepo.findAndCount({
            order: { createdAt: 'DESC' },
        });
        return { success: true, data, total };
    }
    async findOne(id) {
        const p = await this.partnerRepo.findOne({ where: { id } });
        if (!p)
            throw new common_1.NotFoundException('Partner not found');
        return { success: true, data: p };
    }
    async create(dto) {
        const p = this.partnerRepo.create({
            ...dto,
            status: 'active',
        });
        const saved = await this.partnerRepo.save(p);
        return { success: true, data: saved };
    }
    async update(id, dto) {
        const p = await this.partnerRepo.findOne({ where: { id } });
        if (!p)
            throw new common_1.NotFoundException('Partner not found');
        Object.assign(p, dto);
        const saved = await this.partnerRepo.save(p);
        return { success: true, data: saved };
    }
    async delete(id) {
        const result = await this.partnerRepo.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException('Partner not found');
        return { success: true, message: 'Partner removed' };
    }
    async getCommissions(partnerId) {
        const data = await this.commissionRepo.find({
            where: { partnerId },
            order: { createdAt: 'DESC' },
        });
        return { success: true, data };
    }
    async createCommission(partnerId, dto) {
        const c = this.commissionRepo.create({
            partnerId,
            ...dto,
            status: 'pending',
        });
        const saved = await this.commissionRepo.save(c);
        return { success: true, data: saved };
    }
    async findAllAgreements(query) {
        const data = await this.agreementRepo.find({
            relations: ['partner'],
            order: { createdAt: 'DESC' },
        });
        return { success: true, data };
    }
    async createAgreement(dto) {
        const a = this.agreementRepo.create({
            ...dto,
            status: 'active',
        });
        const saved = await this.agreementRepo.save(a);
        return { success: true, data: saved };
    }
};
exports.PartnersService = PartnersService;
exports.PartnersService = PartnersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(partner_entity_1.Partner)),
    __param(1, (0, typeorm_1.InjectRepository)(commission_entity_1.Commission)),
    __param(2, (0, typeorm_1.InjectRepository)(agreement_entity_1.Agreement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PartnersService);
//# sourceMappingURL=partners.service.js.map