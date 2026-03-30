import { Campaign } from './campaign.entity';
export declare class Lead {
    id: string;
    campaignId: string;
    campaign: Campaign;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    source: string;
    status: string;
    vehicleInterest: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
