import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async findAll(recipientId?: string) {
    const where: any = {};
    if (recipientId) where.recipientId = recipientId;
    
    const [data, total] = await this.notificationRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: 20, // Limit to recent 20 for notifications
    });
    return { success: true, data, total };
  }

  async markAsRead(id: string) {
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    
    notification.isRead = true;
    await this.notificationRepo.save(notification);
    return { success: true, message: 'Notification marked as read' };
  }

  async create(dto: any) {
    const notification = this.notificationRepo.create(dto);
    const saved = await this.notificationRepo.save(notification);
    return { success: true, data: saved };
  }
}
