import { Repository } from 'typeorm';
import { Deal } from './entities/deal.entity';
export declare class DealsService {
    private readonly dealRepo;
    constructor(dealRepo: Repository<Deal>);
    findAll(query?: any): Promise<{
        success: boolean;
        data: Deal[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: Deal;
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: Deal[];
        message: string;
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
        data: Deal;
    }>;
    updateStage(id: string, dto: any): Promise<{
        success: boolean;
        data: Deal;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        data: Deal;
    }>;
    getStagesSummary(): Promise<{
        success: boolean;
        data: {
            stage: string;
            count: any;
        }[];
    }>;
}
