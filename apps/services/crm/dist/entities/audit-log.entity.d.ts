export declare class AuditLog {
    id: string;
    userId: string;
    action: string;
    resource: string;
    resourceId: string;
    payload: any;
    timestamp: Date;
}
