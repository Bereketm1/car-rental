import { FinanceService } from './finance.service';
export declare class FinanceController {
    private readonly service;
    constructor(service: FinanceService);
    findAll(query: any): Promise<{
        success: boolean;
        data: import("./entities/loan-review.entity").LoanReview[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./entities/loan-review.entity").LoanReview;
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: import("./entities/loan-review.entity").LoanReview[];
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
        data: import("./entities/loan-review.entity").LoanReview;
    }>;
    approve(id: string, dto: any): Promise<{
        success: boolean;
        data: import("./entities/loan-review.entity").LoanReview;
    }>;
    reject(id: string, dto: any): Promise<{
        success: boolean;
        data: import("./entities/loan-review.entity").LoanReview;
    }>;
    requestDocs(dto: any): Promise<{
        success: boolean;
        data: import("./entities/document-request.entity").DocumentRequest[];
    }>;
    getInstitutions(): Promise<{
        success: boolean;
        data: import("./entities/financial-institution.entity").FinancialInstitution[];
        total: number;
    }>;
    createInstitution(dto: any): Promise<{
        success: boolean;
        data: import("./entities/financial-institution.entity").FinancialInstitution[];
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
