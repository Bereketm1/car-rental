import { ProxyService } from '../services/proxy.service';
export declare class NotificationsController {
    private readonly proxy;
    constructor(proxy: ProxyService);
    findAll(query: any): Promise<any>;
    create(body: any): Promise<any>;
    markAsRead(id: string): Promise<any>;
}
