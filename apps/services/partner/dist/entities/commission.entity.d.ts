import { Partner } from './partner.entity';
export declare class Commission {
    id: string;
    partnerId: string;
    partner: Partner;
    dealId: string;
    amount: number;
    status: string;
    paidAt: Date;
    createdAt: Date;
}
