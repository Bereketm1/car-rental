import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from './entities/deal.entity';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepo: Repository<Deal>,
  ) {}

  async findAll(query?: any) {
    let where: any = {};
    if (query?.stage) where.stage = query.stage;
    const [data, total] = await this.dealRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
    });
    return { success: true, data, total };
  }

  async findOne(id: string) {
    const deal = await this.dealRepo.findOne({ where: { id } });
    if (!deal) throw new NotFoundException('Deal not found');
    return { success: true, data: deal };
  }

  async create(dto: any) {
    const deal = this.dealRepo.create({
      ...dto,
      stage: dto.stage || 'inquiry',
    }) as any; // Cast to avoid TypeORM DeepPartial[] overload confusion in some TS versions

    if (deal.totalAmount && !deal.commission) {
      const rate = Number(deal.commissionRate || 5.0) / 100;
      deal.commission = Number(deal.totalAmount) * rate;
    }

    const saved = await this.dealRepo.save(deal);
    return { success: true, data: saved, message: 'Deal created' };
  }

  async update(id: string, dto: any) {
    const deal = await this.dealRepo.findOne({ where: { id } });
    if (!deal) throw new NotFoundException('Deal not found');
    
    Object.assign(deal, dto);
    const saved = await this.dealRepo.save(deal);
    return { success: true, data: saved };
  }

  async updateStage(id: string, dto: any) {
    return this.update(id, { stage: dto.stage });
  }

  async delete(id: string) {
    return this.update(id, { stage: 'cancelled' });
  }

  async getStagesSummary() {
    const stages = ['vehicle_selected', 'loan_applied', 'under_review', 'approved', 'contract_signed', 'completed', 'cancelled'];
    
    // Group by stage using query builder
    const stageCounts = await this.dealRepo
      .createQueryBuilder('deal')
      .select('deal.stage', 'stage')
      .addSelect('COUNT(deal.id)', 'count')
      .groupBy('deal.stage')
      .getRawMany();

    // Map query results to the static stages array to ensure all stages are present (even with 0 count)
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
}
