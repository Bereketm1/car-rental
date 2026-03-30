import { Customer } from './customer.entity';
import { Document } from './document.entity';
export declare class LoanApplication {
    id: string;
    customerId: string;
    customer: Customer;
    vehicleId: string;
    requestedAmount: number;
    termMonths: number;
    monthlyIncome: number;
    employmentStatus: string;
    status: string;
    documents: Document[];
    createdAt: Date;
    updatedAt: Date;
}
