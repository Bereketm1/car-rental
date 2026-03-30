import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanReview } from './entities/loan-review.entity';
import { FinancialInstitution } from './entities/financial-institution.entity';
import { DocumentRequest } from './entities/document-request.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(LoanReview)
    private readonly reviewRepo: Repository<LoanReview>,
    @InjectRepository(FinancialInstitution)
    private readonly institutionRepo: Repository<FinancialInstitution>,
    @InjectRepository(DocumentRequest)
    private readonly requestRepo: Repository<DocumentRequest>,
    private readonly httpService: HttpService,
  ) {}

  // Reviews
  async findAllReviews(query?: any) {
    let where: any = {};
    if (query?.status) where.status = query.status;
    const [data, total] = await this.reviewRepo.findAndCount({
      where,
      relations: ['institutionRef', 'documentRequests'],
      order: { createdAt: 'DESC' },
    });
    return { success: true, data, total };
  }

  async findOneReview(id: string) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['institutionRef', 'documentRequests'],
    });
    if (!review) throw new NotFoundException('Review not found');
    return { success: true, data: review };
  }

  async createReview(dto: any) {
    const review = this.reviewRepo.create({
      ...dto,
      status: 'pending',
    });
    const saved = await this.reviewRepo.save(review);
    return { success: true, data: saved };
  }

  async updateReview(id: string, dto: any) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    
    Object.assign(review, dto);
    const saved = await this.reviewRepo.save(review);
    return { success: true, data: saved };
  }

  async approveReview(id: string, dto: any) {
    const res = await this.updateReview(id, { ...dto, status: 'approved' });
    
    // Automation: Update Deal stage to 'approved'
    const review = res.data;
    if (review.dealId) {
      const dealUrl = process.env.DEAL_SERVICE_URL || 'http://localhost:3004';
      try {
        await firstValueFrom(
          this.httpService.put(`${dealUrl}/deals/${review.dealId}/stage`, { stage: 'approved' })
        );
      } catch (e) {
        console.error('Failed to auto-update deal stage', e.message);
      }
    }
    return res;
  }

  async rejectReview(id: string, dto: any) {
    return this.updateReview(id, { ...dto, status: 'rejected' });
  }

  // Document Requests
  async createDocumentRequest(dto: any) {
    const req = this.requestRepo.create({
      ...dto,
      status: 'requested',
    });
    const saved = await this.requestRepo.save(req);
    return { success: true, data: saved };
  }

  // Institutions
  async findAllInstitutions() {
    const [data, total] = await this.institutionRepo.findAndCount({
      order: { createdAt: 'ASC' },
    });
    return { success: true, data, total };
  }

  async createInstitution(dto: any) {
    const inst = this.institutionRepo.create({
      ...dto,
      status: 'active',
    });
    const saved = await this.institutionRepo.save(inst);
    return { success: true, data: saved };
  }

  // Pipeline
  async getPipeline() {
    const [total, pending, inReview, approved, rejected, moreInfoNeeded] = await Promise.all([
      this.reviewRepo.count(),
      this.reviewRepo.count({ where: { status: 'pending' } }),
      this.reviewRepo.count({ where: { status: 'in_review' } }),
      this.reviewRepo.count({ where: { status: 'approved' } }),
      this.reviewRepo.count({ where: { status: 'rejected' } }),
      this.reviewRepo.count({ where: { status: 'more_info_needed' } }),
    ]);

    const pipeline = {
      pending,
      inReview,
      approved,
      rejected,
      moreInfoNeeded,
      total,
    };
    return { success: true, data: pipeline };
  }
}
