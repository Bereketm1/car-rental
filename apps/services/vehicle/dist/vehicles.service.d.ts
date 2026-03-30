import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Supplier } from './entities/supplier.entity';
export declare class VehiclesService {
    private readonly vehicleRepo;
    private readonly supplierRepo;
    constructor(vehicleRepo: Repository<Vehicle>, supplierRepo: Repository<Supplier>);
    findAllVehicles(query?: any): Promise<{
        success: boolean;
        data: Vehicle[];
        total: number;
    }>;
    findOneVehicle(id: string): Promise<{
        success: boolean;
        data: Vehicle;
    }>;
    createVehicle(dto: any): Promise<{
        success: boolean;
        data: Vehicle[];
        message: string;
    }>;
    updateVehicle(id: string, dto: any): Promise<{
        success: boolean;
        data: Vehicle;
    }>;
    deleteVehicle(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findAllSuppliers(query?: any): Promise<{
        success: boolean;
        data: Supplier[];
        total: number;
    }>;
    createSupplier(dto: any): Promise<{
        success: boolean;
        data: Supplier[];
    }>;
    getInventorySummary(): Promise<{
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
