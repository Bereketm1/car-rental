import { PartnersService } from './partners.service';
export declare class PartnersController {
    private readonly service;
    constructor(service: PartnersService);
    findAll(query: any): Promise<{
        success: boolean;
        data: import("./entities/partner.entity").Partner[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./entities/partner.entity").Partner;
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: import("./entities/partner.entity").Partner[];
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
        data: import("./entities/partner.entity").Partner;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getCommissions(id: string): Promise<{
        success: boolean;
        data: import("./entities/commission.entity").Commission[];
    }>;
    createCommission(id: string, dto: any): Promise<{
        success: boolean;
        data: import("./entities/commission.entity").Commission[];
    }>;
    findAllAgreements(query: any): Promise<{
        success: boolean;
        data: import("./entities/agreement.entity").Agreement[];
    }>;
    createAgreement(dto: any): Promise<{
        success: boolean;
        data: import("./entities/agreement.entity").Agreement[];
    }>;
}
