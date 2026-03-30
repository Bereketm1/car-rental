import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuditLogService } from './audit-log.service';

@ApiTags('audit')
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly service: AuditLogService) {}

  @Get()
  @ApiOperation({ summary: 'List audit logs' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }
}
