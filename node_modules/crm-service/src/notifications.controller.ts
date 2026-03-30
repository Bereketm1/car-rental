import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for a recipient' })
  findAll(@Query('recipientId') recipientId: string) {
    return this.service.findAll(recipientId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a notification' })
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }
}
