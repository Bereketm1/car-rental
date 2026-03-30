import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
export declare class NotificationService {
    private readonly notificationRepo;
    constructor(notificationRepo: Repository<Notification>);
    findAll(recipientId?: string): Promise<{
        success: boolean;
        data: Notification[];
        total: number;
    }>;
    markAsRead(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    create(dto: any): Promise<{
        success: boolean;
        data: Notification[];
    }>;
}
