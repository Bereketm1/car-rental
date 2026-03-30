import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProxyService } from '../services/proxy.service';

@ApiTags('audit')
@Controller('api/audit')
export class AuditLogsController {
  constructor(private readonly proxy: ProxyService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'List audit logs' })
  findAll(@Query() query: any) {
    return this.proxy.forward('crm', 'GET', '/audit-logs', null, query);
  }
}
