import { CustomersService } from './customers.service';
import { CreateCustomerDto, CreateVehicleInterestDto } from './dto';
export declare class CustomersController {
    private readonly service;
    constructor(service: CustomersService);
    findAll(query: any): Promise<{
        success: boolean;
        data: import("./entities/customer.entity").Customer[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./entities/customer.entity").Customer;
    }>;
    create(dto: CreateCustomerDto): Promise<{
        success: boolean;
        data: import("./entities/customer.entity").Customer[];
        message: string;
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
        data: import("./entities/customer.entity").Customer;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addInterest(id: string, dto: CreateVehicleInterestDto): Promise<{
        success: boolean;
        data: import("./entities/vehicle-interest.entity").VehicleInterest[];
    }>;
    getInterests(id: string): Promise<{
        success: boolean;
        data: import("./entities/vehicle-interest.entity").VehicleInterest[];
    }>;
    addDocument(id: string, dto: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getDocuments(id: string): Promise<{
        success: boolean;
        data: any[];
    }>;
}
