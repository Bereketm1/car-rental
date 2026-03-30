import { LoanApplication } from './loan-application.entity';
export declare class Document {
    id: string;
    applicationId: string;
    loanApplication: LoanApplication;
    type: string;
    filename: string;
    url: string;
    uploadedAt: Date;
}
