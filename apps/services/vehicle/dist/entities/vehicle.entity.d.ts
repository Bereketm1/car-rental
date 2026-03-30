import { Supplier } from './supplier.entity';
export declare class Vehicle {
    id: string;
    supplierId: string;
    supplier: Supplier;
    supplierName: string;
    make: string;
    model: string;
    year: number;
    color: string;
    mileage: number;
    price: number;
    condition: string;
    fuelType: string;
    transmission: string;
    status: string;
    images: string[];
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
