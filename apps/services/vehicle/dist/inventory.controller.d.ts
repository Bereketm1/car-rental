import { VehiclesService } from './vehicles.service';
export declare class InventoryController {
    private readonly service;
    constructor(service: VehiclesService);
    getSummary(): Promise<{
        success: boolean;
        data: {
            total: number;
            available: number;
            reserved: number;
            sold: number;
            byMake: any;
        };
    }>;
}
