import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { VehicleInterest } from './entities/vehicle-interest.entity';
export declare class CustomersService {
    private readonly customerRepo;
    private readonly interestRepo;
    constructor(customerRepo: Repository<Customer>, interestRepo: Repository<VehicleInterest>);
    findAll(query?: any): Promise<{
        success: boolean;
        data: Customer[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: Customer;
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: Customer[];
        message: string;
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
        data: Customer;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addInterest(customerId: string, dto: any): Promise<{
        success: boolean;
        data: VehicleInterest[];
    }>;
    getInterests(customerId: string): Promise<{
        success: boolean;
        data: VehicleInterest[];
    }>;
    addDocument(customerId: string, document: any): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    getDocuments(customerId: string): Promise<{
        success: boolean;
        data: any[];
    }>;
}
