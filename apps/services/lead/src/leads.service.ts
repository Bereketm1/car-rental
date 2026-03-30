import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { Campaign } from './entities/campaign.entity';
import { Referral } from './entities/referral.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(Referral)
    private readonly referralRepo: Repository<Referral>,
  ) {}

  // Leads
  async findAllLeads(query?: any) {
    let where: any = {};
    if (query?.status) where.status = query.status;
    if (query?.source) where.source = query.source;
    
    const [data, total] = await this.leadRepo.findAndCount({
      where,
      relations: ['campaign'],
      order: { createdAt: 'DESC' },
    });
    return { success: true, data, total };
  }

  async findOneLead(id: string) {
    const lead = await this.leadRepo.findOne({
      where: { id },
      relations: ['campaign'],
    });
    if (!lead) throw new NotFoundException('Lead not found');
    return { success: true, data: lead };
  }

  async createLead(dto: any) {
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

  async updateLead(id: string, dto: any) {
    const lead = await this.leadRepo.findOne({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    
    const wasConverted = lead.status !== 'converted' && dto.status === 'converted';
    
    Object.assign(lead, dto);
    const saved = await this.leadRepo.save(lead);
    
    if (wasConverted && lead.campaignId) {
      await this.campaignRepo.increment({ id: lead.campaignId }, 'conversions', 1);
    }
    
    return { success: true, data: saved };
  }

  async deleteLead(id: string) {
    const result = await this.leadRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Lead not found');
    return { success: true, message: 'Lead deleted' };
  }

  // Campaigns
  async findAllCampaigns(query?: any) {
    const data = await this.campaignRepo.find({
      order: { createdAt: 'DESC' },
    });
    return { success: true, data };
  }

  async createCampaign(dto: any) {
    const c = this.campaignRepo.create({
      ...dto,
      leadsGenerated: 0,
      conversions: 0,
      status: 'draft',
    });
    const saved = await this.campaignRepo.save(c);
    return { success: true, data: saved };
  }

  async updateCampaign(id: string, dto: any) {
    const c = await this.campaignRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Campaign not found');
    
    Object.assign(c, dto);
    const saved = await this.campaignRepo.save(c);
    return { success: true, data: saved };
  }

  // Referrals
  async findAllReferrals(query?: any) {
    const data = await this.referralRepo.find({
      order: { createdAt: 'DESC' },
    });
    return { success: true, data };
  }

  async createReferral(dto: any) {
    const r = this.referralRepo.create({
      ...dto,
      status: 'pending',
      rewardStatus: 'pending',
    });
    const saved = await this.referralRepo.save(r);
    return { success: true, data: saved };
  }
}
