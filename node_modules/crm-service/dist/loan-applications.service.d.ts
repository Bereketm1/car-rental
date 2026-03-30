import { Repository } from 'typeorm';
import { LoanApplication } from './entities/loan-application.entity';
export declare class LoanApplicationsService {
    private readonly applicationRepo;
    constructor(applicationRepo: Repository<LoanApplication>);
    findAll(query?: any): Promise<{
        success: boolean;
        data: LoanApplication[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: LoanApplication;
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: LoanApplication[];
        message: string;
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
        data: LoanApplication;
    }>;
}
