import { ProxyService } from '../services/proxy.service';
export declare class VehiclesController {
    private readonly proxy;
    constructor(proxy: ProxyService);
    findAll(query: any): Promise<any>;
    findOne(id: string): Promise<any>;
    create(body: any): Promise<any>;
    update(id: string, body: any): Promise<any>;
    delete(id: string): Promise<any>;
    getSuppliers(query: any): Promise<any>;
    createSupplier(body: any): Promise<any>;
    getInventory(): Promise<any>;
}
