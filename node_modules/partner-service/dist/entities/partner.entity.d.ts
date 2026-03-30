import { Commission } from './commission.entity';
import { Agreement } from './agreement.entity';
export declare class Partner {
    id: string;
    type: string;
    entityId: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    commissionRate: number;
    status: string;
    commissions: Commission[];
    agreements: Agreement[];
    createdAt: Date;
    updatedAt: Date;
}
