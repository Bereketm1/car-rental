import { Lead } from './lead.entity';
export declare class Campaign {
    id: string;
    name: string;
    type: string;
    budget: number;
    spent: number;
    startDate: Date;
    endDate: Date;
    description: string;
    status: string;
    leadsGenerated: number;
    conversions: number;
    leads: Lead[];
    createdAt: Date;
    updatedAt: Date;
}
