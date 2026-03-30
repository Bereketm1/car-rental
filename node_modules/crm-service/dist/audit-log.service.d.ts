import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
export declare class AuditLogService {
    private readonly auditRepo;
    constructor(auditRepo: Repository<AuditLog>);
    findAll(query?: any): Promise<{
        success: boolean;
        data: AuditLog[];
        total: number;
    }>;
    create(logData: any): Promise<AuditLog[]>;
}
