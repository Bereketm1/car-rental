import { ProxyService } from '../services/proxy.service';
export declare class CustomersController {
    private readonly proxy;
    constructor(proxy: ProxyService);
    findAll(query: any): Promise<any>;
    findOne(id: string): Promise<any>;
    create(body: any): Promise<any>;
    update(id: string, body: any): Promise<any>;
    delete(id: string): Promise<any>;
    addInterest(id: string, body: any): Promise<any>;
    getInterests(id: string): Promise<any>;
    addDocument(id: string, body: any): Promise<any>;
    getDocuments(id: string): Promise<any>;
    submitLoan(body: any): Promise<any>;
    getLoanApplications(query: any): Promise<any>;
    trackLoan(id: string): Promise<any>;
}
