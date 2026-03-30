import { ProxyService } from '../services/proxy.service';
export declare class DealsController {
    private readonly proxy;
    constructor(proxy: ProxyService);
    findAll(query: any): Promise<any>;
    findOne(id: string): Promise<any>;
    create(body: any): Promise<any>;
    update(id: string, body: any): Promise<any>;
    updateStage(id: string, body: any): Promise<any>;
    delete(id: string): Promise<any>;
    getStagesSummary(): Promise<any>;
}
