import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanApplication } from './entities/loan-application.entity';

@Injectable()
export class LoanApplicationsService {
  constructor(
    @InjectRepository(LoanApplication)
    private readonly applicationRepo: Repository<LoanApplication>,
  ) {}

  async findAll(query?: any) {
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

  async findOne(id: string) {
    const app = await this.applicationRepo.findOne({
      where: { id },
      relations: ['customer', 'documents'],
    });
    if (!app) throw new NotFoundException('Loan application not found');
    return { success: true, data: app };
  }

  async create(dto: any) {
    const application = this.applicationRepo.create({
      ...dto,
      status: 'submitted',
    });
    const saved = await this.applicationRepo.save(application);
    return { success: true, data: saved, message: 'Loan application submitted' };
  }

  async update(id: string, dto: any) {
    const app = await this.applicationRepo.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Loan application not found');
    
    Object.assign(app, dto);
    const saved = await this.applicationRepo.save(app);
    return { success: true, data: saved };
  }
}
