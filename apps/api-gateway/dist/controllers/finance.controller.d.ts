import { ProxyService } from '../services/proxy.service';
export declare class FinanceController {
    private readonly proxy;
    constructor(proxy: ProxyService);
    findAll(query: any): Promise<any>;
    findOne(id: string): Promise<any>;
    create(body: any): Promise<any>;
    update(id: string, body: any): Promise<any>;
    approve(id: string, body: any): Promise<any>;
    reject(id: string, body: any): Promise<any>;
    requestDocuments(body: any): Promise<any>;
    getInstitutions(): Promise<any>;
    createInstitution(body: any): Promise<any>;
    getPipeline(): Promise<any>;
}
