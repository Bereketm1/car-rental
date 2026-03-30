import { ProxyService } from '../services/proxy.service';
export declare class LeadsController {
    private readonly proxy;
    constructor(proxy: ProxyService);
    findAll(query: any): Promise<any>;
    findOne(id: string): Promise<any>;
    create(body: any): Promise<any>;
    update(id: string, body: any): Promise<any>;
    delete(id: string): Promise<any>;
    getCampaigns(query: any): Promise<any>;
    createCampaign(body: any): Promise<any>;
    updateCampaign(id: string, body: any): Promise<any>;
    getReferrals(query: any): Promise<any>;
    createReferral(body: any): Promise<any>;
}
