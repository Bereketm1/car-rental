export declare class CreateCustomerDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationalId?: string;
    address?: string;
    city?: string;
}
export declare class CreateLoanApplicationDto {
    customerId: string;
    vehicleId: string;
    requestedAmount: number;
    termMonths: number;
    monthlyIncome: number;
    employmentStatus: string;
}
export declare class CreateVehicleInterestDto {
    vehicleId: string;
    notes?: string;
}
