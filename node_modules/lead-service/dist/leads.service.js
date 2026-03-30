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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lead_entity_1 = require("./entities/lead.entity");
const campaign_entity_1 = require("./entities/campaign.entity");
const referral_entity_1 = require("./entities/referral.entity");
let LeadsService = class LeadsService {
    constructor(leadRepo, campaignRepo, referralRepo) {
        this.leadRepo = leadRepo;
        this.campaignRepo = campaignRepo;
        this.referralRepo = referralRepo;
    }
    async findAllLeads(query) {
        let where = {};
        if (query?.status)
            where.status = query.status;
        if (query?.source)
            where.source = query.source;
        const [data, total] = await this.leadRepo.findAndCount({
            where,
            relations: ['campaign'],
            order: { createdAt: 'DESC' },
        });
        return { success: true, data, total };
    }
    async findOneLead(id) {
        const lead = await this.leadRepo.findOne({
            where: { id },
            relations: ['campaign'],
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        return { success: true, data: lead };
    }
    async createLead(dto) {
        const lead = this.leadRepo.create({
            ...dto,
            status: 'new',
        });
        const saved = await this.leadRepo.save(lead);
        if (dto.campaignId) {
            await this.campaignRepo.increment({ id: dto.campaignId }, 'leadsGenerated', 1);
        }
        return { success: true, data: saved };
    }
    async updateLead(id, dto) {
        const lead = await this.leadRepo.findOne({ where: { id } });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        const wasConverted = lead.status !== 'converted' && dto.status === 'converted';
        Object.assign(lead, dto);
        const saved = await this.leadRepo.save(lead);
        if (wasConverted && lead.campaignId) {
            await this.campaignRepo.increment({ id: lead.campaignId }, 'conversions', 1);
        }
        return { success: true, data: saved };
    }
    async deleteLead(id) {
        const result = await this.leadRepo.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException('Lead not found');
        return { success: true, message: 'Lead deleted' };
    }
    async findAllCampaigns(query) {
        const data = await this.campaignRepo.find({
            order: { createdAt: 'DESC' },
        });
        return { success: true, data };
    }
    async createCampaign(dto) {
        const c = this.campaignRepo.create({
            ...dto,
            leadsGenerated: 0,
            conversions: 0,
            status: 'draft',
        });
        const saved = await this.campaignRepo.save(c);
        return { success: true, data: saved };
    }
    async updateCampaign(id, dto) {
        const c = await this.campaignRepo.findOne({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException('Campaign not found');
        Object.assign(c, dto);
        const saved = await this.campaignRepo.save(c);
        return { success: true, data: saved };
    }
    async findAllReferrals(query) {
        const data = await this.referralRepo.find({
            order: { createdAt: 'DESC' },
        });
        return { success: true, data };
    }
    async createReferral(dto) {
        const r = this.referralRepo.create({
            ...dto,
            status: 'pending',
            rewardStatus: 'pending',
        });
        const saved = await this.referralRepo.save(r);
        return { success: true, data: saved };
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lead_entity_1.Lead)),
    __param(1, (0, typeorm_1.InjectRepository)(campaign_entity_1.Campaign)),
    __param(2, (0, typeorm_1.InjectRepository)(referral_entity_1.Referral)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LeadsService);
//# sourceMappingURL=leads.service.js.map