import { LoanReview } from './loan-review.entity';
export declare class DocumentRequest {
    id: string;
    reviewId: string;
    review: LoanReview;
    documentType: string;
    description: string;
    status: string;
    createdAt: Date;
}
