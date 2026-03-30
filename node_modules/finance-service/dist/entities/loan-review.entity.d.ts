import { FinancialInstitution } from './financial-institution.entity';
import { DocumentRequest } from './document-request.entity';
export declare class LoanReview {
    id: string;
    applicationId: string;
    dealId: string;
    institutionId: string;
    institutionRef: FinancialInstitution;
    institution: string;
    customerName: string;
    vehicleDescription: string;
    reviewerName: string;
    status: string;
    requestedAmount: number;
    approvedAmount: number;
    interestRate: number;
    term: number;
    termMonths: number;
    notes: string;
    documentRequests: DocumentRequest[];
    createdAt: Date;
    updatedAt: Date;
}
