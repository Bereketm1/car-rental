import { VehicleInterest } from './vehicle-interest.entity';
import { LoanApplication } from './loan-application.entity';
export declare class Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationalId: string;
    address: string;
    city: string;
    documents: any[];
    interests: VehicleInterest[];
    loanApplications: LoanApplication[];
    createdAt: Date;
    updatedAt: Date;
}
