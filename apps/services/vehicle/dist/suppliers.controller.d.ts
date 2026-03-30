import { VehiclesService } from './vehicles.service';
export declare class SuppliersController {
    private readonly service;
    constructor(service: VehiclesService);
    findAll(query: any): Promise<{
        success: boolean;
        data: import("./entities/supplier.entity").Supplier[];
        total: number;
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: import("./entities/supplier.entity").Supplier[];
    }>;
}
