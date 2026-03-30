import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { Commission } from './entities/commission.entity';
import { Agreement } from './entities/agreement.entity';
export declare class PartnersService {
    private readonly partnerRepo;
    private readonly commissionRepo;
    private readonly agreementRepo;
    constructor(partnerRepo: Repository<Partner>, commissionRepo: Repository<Commission>, agreementRepo: Repository<Agreement>);
    findAll(query?: any): Promise<{
        success: boolean;
        data: Partner[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: Partner;
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: Partner[];
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
        data: Partner;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getCommissions(partnerId: string): Promise<{
        success: boolean;
        data: Commission[];
    }>;
    createCommission(partnerId: string, dto: any): Promise<{
        success: boolean;
        data: Commission[];
    }>;
    findAllAgreements(query?: any): Promise<{
        success: boolean;
        data: Agreement[];
    }>;
    createAgreement(dto: any): Promise<{
        success: boolean;
        data: Agreement[];
    }>;
}
