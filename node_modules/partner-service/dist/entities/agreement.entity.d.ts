import { Partner } from './partner.entity';
export declare class Agreement {
    id: string;
    partnerId: string;
    partner: Partner;
    title: string;
    terms: string;
    startDate: Date;
    endDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
