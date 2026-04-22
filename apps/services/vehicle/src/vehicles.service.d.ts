import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Supplier } from './entities/supplier.entity';
export declare class VehiclesService {
    private readonly vehicleRepo;
    private readonly supplierRepo;
    constructor(vehicleRepo: Repository<Vehicle>, supplierRepo: Repository<Supplier>);
    findAllVehicles(query?: any): Promise<{
        success: boolean;
        data: any;
        total: any;
    }>;
    findOneVehicle(id: string): Promise<{
        success: boolean;
        data: any;
    }>;
    createVehicle(dto: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    updateVehicle(id: string, dto: any): Promise<{
        success: boolean;
        data: any;
    }>;
    deleteVehicle(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findAllSuppliers(query?: any): Promise<{
        success: boolean;
        data: any;
        total: any;
    }>;
    createSupplier(dto: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getInventorySummary(): Promise<{
        success: boolean;
        data: {
            total: any;
            available: any;
            reserved: any;
            sold: any;
            byMake: any;
        };
    }>;
}
