"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
let NotificationService = class NotificationService {
    constructor(notificationRepo) {
        this.notificationRepo = notificationRepo;
    }
    async findAll(recipientId) {
        const where = {};
        if (recipientId)
            where.recipientId = recipientId;
        const [data, total] = await this.notificationRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            take: 20,
        });
        return { success: true, data, total };
    }
    async markAsRead(id) {
        const notification = await this.notificationRepo.findOne({ where: { id } });
        if (!notification)
            throw new common_1.NotFoundException('Notification not found');
        notification.isRead = true;
        await this.notificationRepo.save(notification);
        return { success: true, message: 'Notification marked as read' };
    }
    async create(dto) {
        const notification = this.notificationRepo.create(dto);
        const saved = await this.notificationRepo.save(notification);
        return { success: true, data: saved };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationService);
//# sourceMappingURL=notifications.service.js.map