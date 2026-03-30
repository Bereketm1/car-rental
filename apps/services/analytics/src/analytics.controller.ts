import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get overall analytics summary' })
  getSummary() { return this.service.getSummary(); }

  @Get('sales')
  @ApiOperation({ summary: 'Get vehicle sales analytics' })
  @ApiQuery({ name: 'period', required: false, enum: ['week', 'month', 'quarter', 'year'] })
  getSales(@Query() query: any) { return this.service.getSales(query); }

  @Get('financing')
  @ApiOperation({ summary: 'Get financing approval analytics' })
  getFinancing(@Query() query: any) { return this.service.getFinancing(query); }

  @Get('partners')
  @ApiOperation({ summary: 'Get partner performance analytics' })
  getPartners(@Query() query: any) { return this.service.getPartnerPerformance(query); }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  getRevenue(@Query() query: any) { return this.service.getRevenue(query); }

  @Get('trends')
  @ApiOperation({ summary: 'Get monthly trends' })
  getTrends(@Query() query: any) { return this.service.getTrends(query); }
}
