import { VehiclesService } from './vehicles.service';
export declare class VehiclesController {
    private readonly service;
    constructor(service: VehiclesService);
    findAll(query: any): Promise<{
        success: boolean;
        data: import("./entities/vehicle.entity").Vehicle[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./entities/vehicle.entity").Vehicle;
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: import("./entities/vehicle.entity").Vehicle[];
        message: string;
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
        data: import("./entities/vehicle.entity").Vehicle;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
