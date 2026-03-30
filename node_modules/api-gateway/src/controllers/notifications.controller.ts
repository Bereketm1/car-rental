import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProxyService } from '../services/proxy.service';

@ApiTags('notifications')
@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly proxy: ProxyService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'List notifications' })
  findAll(@Query() query: any) {
    return this.proxy.forward('crm', 'GET', '/notifications', null, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create notification' })
  create(@Body() body: any) {
    return this.proxy.forward('crm', 'POST', '/notifications', body);
  }

  @Put(':id/read')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Mark as read' })
  markAsRead(@Param('id') id: string) {
    return this.proxy.forward('crm', 'PUT', `/notifications/${id}/read`);
  }
}
