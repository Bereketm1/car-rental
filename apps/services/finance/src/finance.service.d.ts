import { Repository } from 'typeorm';
import { LoanReview } from './entities/loan-review.entity';
import { FinancialInstitution } from './entities/financial-institution.entity';
import { DocumentRequest } from './entities/document-request.entity';
import { HttpService } from '@nestjs/axios';
export declare class FinanceService {
    private readonly reviewRepo;
    private readonly institutionRepo;
    private readonly requestRepo;
    private readonly httpService;
    constructor(reviewRepo: Repository<LoanReview>, institutionRepo: Repository<FinancialInstitution>, requestRepo: Repository<DocumentRequest>, httpService: HttpService);
    findAllReviews(query?: any): Promise<{
        success: boolean;
        data: any;
        total: any;
    }>;
    findOneReview(id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    createReview(dto: any): Promise<{
        success: boolean;
        data: any;
    }>;
    updateReview(id: string, dto: any): Promise<{
        success: boolean;
        data: any;
    }>;
    approveReview(id: string, dto: any): Promise<{
        success: boolean;
        data: any;
    }>;
    rejectReview(id: string, dto: any): Promise<{
        success: boolean;
        data: any;
    }>;
    createDocumentRequest(dto: any): Promise<{
        success: boolean;
        data: any;
    }>;
    findAllInstitutions(): Promise<{
        success: boolean;
        data: any;
        total: any;
    }>;
    createInstitution(dto: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getPipeline(): Promise<{
        success: boolean;
        data: {
            pending: any;
            inReview: any;
            approved: any;
            rejected: any;
            moreInfoNeeded: any;
            total: any;
        };
    }>;
}
