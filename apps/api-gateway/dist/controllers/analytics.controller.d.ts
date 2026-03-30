import { ProxyService } from '../services/proxy.service';
export declare class AnalyticsController {
    private readonly proxy;
    constructor(proxy: ProxyService);
    getSummary(): Promise<any>;
    getSales(query: any): Promise<any>;
    getFinancing(query: any): Promise<any>;
    getPartners(query: any): Promise<any>;
    getRevenue(query: any): Promise<any>;
    getTrends(query: any): Promise<any>;
}
