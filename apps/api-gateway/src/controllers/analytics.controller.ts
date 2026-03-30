import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProxyService } from '../services/proxy.service';

@ApiTags('analytics')
@Controller('api/analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(private readonly proxy: ProxyService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get overall analytics summary' })
  getSummary() {
    return this.proxy.forward('analytics', 'GET', '/analytics/summary');
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get vehicle sales analytics' })
  @ApiQuery({ name: 'period', required: false, enum: ['week', 'month', 'quarter', 'year'] })
  getSales(@Query() query: any) {
    return this.proxy.forward('analytics', 'GET', '/analytics/sales', undefined, query);
  }

  @Get('financing')
  @ApiOperation({ summary: 'Get financing approval analytics' })
  getFinancing(@Query() query: any) {
    return this.proxy.forward('analytics', 'GET', '/analytics/financing', undefined, query);
  }

  @Get('partners')
  @ApiOperation({ summary: 'Get partner performance analytics' })
  getPartners(@Query() query: any) {
    return this.proxy.forward('analytics', 'GET', '/analytics/partners', undefined, query);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  getRevenue(@Query() query: any) {
    return this.proxy.forward('analytics', 'GET', '/analytics/revenue', undefined, query);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get monthly trends' })
  getTrends(@Query() query: any) {
    return this.proxy.forward('analytics', 'GET', '/analytics/trends', undefined, query);
  }
}
