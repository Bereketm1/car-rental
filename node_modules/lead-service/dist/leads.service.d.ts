import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { Campaign } from './entities/campaign.entity';
import { Referral } from './entities/referral.entity';
export declare class LeadsService {
    private readonly leadRepo;
    private readonly campaignRepo;
    private readonly referralRepo;
    constructor(leadRepo: Repository<Lead>, campaignRepo: Repository<Campaign>, referralRepo: Repository<Referral>);
    findAllLeads(query?: any): Promise<{
        success: boolean;
        data: Lead[];
        total: number;
    }>;
    findOneLead(id: string): Promise<{
        success: boolean;
        data: Lead;
    }>;
    createLead(dto: any): Promise<{
        success: boolean;
        data: Lead[];
    }>;
    updateLead(id: string, dto: any): Promise<{
        success: boolean;
        data: Lead;
    }>;
    deleteLead(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findAllCampaigns(query?: any): Promise<{
        success: boolean;
        data: Campaign[];
    }>;
    createCampaign(dto: any): Promise<{
        success: boolean;
        data: Campaign[];
    }>;
    updateCampaign(id: string, dto: any): Promise<{
        success: boolean;
        data: Campaign;
    }>;
    findAllReferrals(query?: any): Promise<{
        success: boolean;
        data: Referral[];
    }>;
    createReferral(dto: any): Promise<{
        success: boolean;
        data: Referral[];
    }>;
}
