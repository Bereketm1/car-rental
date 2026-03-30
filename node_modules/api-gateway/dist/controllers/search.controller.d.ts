import { ProxyService } from '../services/proxy.service';
export declare class SearchController {
    private readonly proxy;
    constructor(proxy: ProxyService);
    globalSearch(q: string): Promise<{
        success: boolean;
        data: {
            customers: any;
            vehicles: any;
            deals: any;
        };
    }>;
}
