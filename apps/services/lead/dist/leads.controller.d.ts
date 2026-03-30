import { LeadsService } from './leads.service';
export declare class LeadsController {
    private readonly service;
    constructor(service: LeadsService);
    findAll(query: any): Promise<{
        success: boolean;
        data: import("./entities/lead.entity").Lead[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./entities/lead.entity").Lead;
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: import("./entities/lead.entity").Lead[];
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
        data: import("./entities/lead.entity").Lead;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getCampaigns(query: any): Promise<{
        success: boolean;
        data: import("./entities/campaign.entity").Campaign[];
    }>;
    createCampaign(dto: any): Promise<{
        success: boolean;
        data: import("./entities/campaign.entity").Campaign[];
    }>;
    updateCampaign(id: string, dto: any): Promise<{
        success: boolean;
        data: import("./entities/campaign.entity").Campaign;
    }>;
    getReferrals(query: any): Promise<{
        success: boolean;
        data: import("./entities/referral.entity").Referral[];
    }>;
    createReferral(dto: any): Promise<{
        success: boolean;
        data: import("./entities/referral.entity").Referral[];
    }>;
}
