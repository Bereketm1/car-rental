import { AuditLogService } from './audit-log.service';
export declare class AuditLogController {
    private readonly service;
    constructor(service: AuditLogService);
    findAll(query: any): Promise<{
        success: boolean;
        data: import("./entities/audit-log.entity").AuditLog[];
        total: number;
    }>;
}
