import { LoanReview } from './loan-review.entity';
export declare class FinancialInstitution {
    id: string;
    name: string;
    code: string;
    type: string;
    contactPerson: string;
    email: string;
    phone: string;
    interestRateMin: number;
    interestRateMax: number;
    interestRate: number;
    maxLoanAmount: number;
    maxTerm: number;
    status: string;
    loanReviews: LoanReview[];
    createdAt: Date;
}
