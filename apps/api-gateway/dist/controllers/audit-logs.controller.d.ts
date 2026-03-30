import { ProxyService } from '../services/proxy.service';
export declare class AuditLogsController {
    private readonly proxy;
    constructor(proxy: ProxyService);
    findAll(query: any): Promise<any>;
}
