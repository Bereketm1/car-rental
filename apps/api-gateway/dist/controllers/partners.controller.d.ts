import { ProxyService } from '../services/proxy.service';
export declare class PartnersController {
    private readonly proxy;
    constructor(proxy: ProxyService);
    findAll(query: any): Promise<any>;
    findOne(id: string): Promise<any>;
    create(body: any): Promise<any>;
    update(id: string, body: any): Promise<any>;
    delete(id: string): Promise<any>;
    getCommissions(id: string): Promise<any>;
    createCommission(id: string, body: any): Promise<any>;
    getAgreements(query: any): Promise<any>;
    createAgreement(body: any): Promise<any>;
}
