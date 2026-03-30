import { LoanApplicationsService } from './loan-applications.service';
import { CreateLoanApplicationDto } from './dto';
export declare class LoanApplicationsController {
    private readonly service;
    constructor(service: LoanApplicationsService);
    findAll(query: any): Promise<{
        success: boolean;
        data: import("./entities/loan-application.entity").LoanApplication[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./entities/loan-application.entity").LoanApplication;
    }>;
    create(dto: CreateLoanApplicationDto): Promise<{
        success: boolean;
        data: import("./entities/loan-application.entity").LoanApplication[];
        message: string;
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
        data: import("./entities/loan-application.entity").LoanApplication;
    }>;
}
