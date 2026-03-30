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
        data: LoanReview[];
        total: number;
    }>;
    findOneReview(id: string): Promise<{
        success: boolean;
        data: LoanReview;
    }>;
    createReview(dto: any): Promise<{
        success: boolean;
        data: LoanReview[];
    }>;
    updateReview(id: string, dto: any): Promise<{
        success: boolean;
        data: LoanReview;
    }>;
    approveReview(id: string, dto: any): Promise<{
        success: boolean;
        data: LoanReview;
    }>;
    rejectReview(id: string, dto: any): Promise<{
        success: boolean;
        data: LoanReview;
    }>;
    createDocumentRequest(dto: any): Promise<{
        success: boolean;
        data: DocumentRequest[];
    }>;
    findAllInstitutions(): Promise<{
        success: boolean;
        data: FinancialInstitution[];
        total: number;
    }>;
    createInstitution(dto: any): Promise<{
        success: boolean;
        data: FinancialInstitution[];
    }>;
    getPipeline(): Promise<{
        success: boolean;
        data: {
            pending: number;
            inReview: number;
            approved: number;
            rejected: number;
            moreInfoNeeded: number;
            total: number;
        };
    }>;
}
