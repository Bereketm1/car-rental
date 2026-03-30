import { DealsService } from './deals.service';
export declare class DealsController {
    private readonly service;
    constructor(service: DealsService);
    findAll(query: any): Promise<{
        success: boolean;
        data: import("./entities/deal.entity").Deal[];
        total: number;
    }>;
    getStagesSummary(): Promise<{
        success: boolean;
        data: {
            stage: string;
            count: any;
        }[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./entities/deal.entity").Deal;
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: import("./entities/deal.entity").Deal[];
        message: string;
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
        data: import("./entities/deal.entity").Deal;
    }>;
    updateStage(id: string, dto: any): Promise<{
        success: boolean;
        data: import("./entities/deal.entity").Deal;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        data: import("./entities/deal.entity").Deal;
    }>;
}
