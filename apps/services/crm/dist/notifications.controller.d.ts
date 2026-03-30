import { NotificationService } from './notifications.service';
export declare class NotificationController {
    private readonly service;
    constructor(service: NotificationService);
    findAll(recipientId: string): Promise<{
        success: boolean;
        data: import("./entities/notification.entity").Notification[];
        total: number;
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: import("./entities/notification.entity").Notification[];
    }>;
    markAsRead(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
