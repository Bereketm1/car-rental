import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { Commission } from './entities/commission.entity';
import { Agreement } from './entities/agreement.entity';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepo: Repository<Partner>,
    @InjectRepository(Commission)
    private readonly commissionRepo: Repository<Commission>,
    @InjectRepository(Agreement)
    private readonly agreementRepo: Repository<Agreement>,
  ) {}

  // Partners
  async findAll(query?: any) {
    const [data, total] = await this.partnerRepo.findAndCount({
      order: { createdAt: 'DESC' },
    });
    return { success: true, data, total };
  }

  async findOne(id: string) {
    const p = await this.partnerRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Partner not found');
    return { success: true, data: p };
  }

  async create(dto: any) {
    const p = this.partnerRepo.create({
      ...dto,
      status: 'active',
    });
    const saved = await this.partnerRepo.save(p);
    return { success: true, data: saved };
  }

  async update(id: string, dto: any) {
    const p = await this.partnerRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Partner not found');
    
    Object.assign(p, dto);
    const saved = await this.partnerRepo.save(p);
    return { success: true, data: saved };
  }

  async delete(id: string) {
    const result = await this.partnerRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Partner not found');
    return { success: true, message: 'Partner removed' };
  }

  // Commissions
  async getCommissions(partnerId: string) {
    const data = await this.commissionRepo.find({
      where: { partnerId },
      order: { createdAt: 'DESC' },
    });
    return { success: true, data };
  }

  async createCommission(partnerId: string, dto: any) {
    const c = this.commissionRepo.create({
      partnerId,
      ...dto,
      status: 'pending',
    });
    const saved = await this.commissionRepo.save(c);
    return { success: true, data: saved };
  }

  // Agreements
  async findAllAgreements(query?: any) {
    const data = await this.agreementRepo.find({
      relations: ['partner'],
      order: { createdAt: 'DESC' },
    });
    return { success: true, data };
  }

  async createAgreement(dto: any) {
    const a = this.agreementRepo.create({
      ...dto,
      status: 'active',
    });
    const saved = await this.agreementRepo.save(a);
    return { success: true, data: saved };
  }
}
