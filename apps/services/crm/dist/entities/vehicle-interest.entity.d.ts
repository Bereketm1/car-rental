import { Customer } from './customer.entity';
export declare class VehicleInterest {
    id: string;
    customerId: string;
    customer: Customer;
    vehicleId: string;
    notes: string;
    createdAt: Date;
}
