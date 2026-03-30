import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProxyService } from '../services/proxy.service';

@ApiTags('leads')
@Controller('api/leads')
@UseGuards(AuthGuard)
export class LeadsController {
  constructor(private readonly proxy: ProxyService) {}

  @Get()
  @ApiOperation({ summary: 'List all leads' })
  findAll(@Query() query: any) {
    return this.proxy.forward('lead', 'GET', '/leads', undefined, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by ID' })
  findOne(@Param('id') id: string) {
    return this.proxy.forward('lead', 'GET', `/leads/${id}`);
  }

  @Post()
  @ApiOperation({ summary: 'Capture new lead' })
  create(@Body() body: any) {
    return this.proxy.forward('lead', 'POST', '/leads', body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lead' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('lead', 'PUT', `/leads/${id}`, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead' })
  delete(@Param('id') id: string) {
    return this.proxy.forward('lead', 'DELETE', `/leads/${id}`);
  }

  @Get('campaigns/all')
  @ApiOperation({ summary: 'List all campaigns' })
  getCampaigns(@Query() query: any) {
    return this.proxy.forward('lead', 'GET', '/campaigns', undefined, query);
  }

  @Post('campaigns')
  @ApiOperation({ summary: 'Create new campaign' })
  createCampaign(@Body() body: any) {
    return this.proxy.forward('lead', 'POST', '/campaigns', body);
  }

  @Put('campaigns/:id')
  @ApiOperation({ summary: 'Update campaign' })
  updateCampaign(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('lead', 'PUT', `/campaigns/${id}`, body);
  }

  @Get('referrals/all')
  @ApiOperation({ summary: 'List all referrals' })
  getReferrals(@Query() query: any) {
    return this.proxy.forward('lead', 'GET', '/referrals', undefined, query);
  }

  @Post('referrals')
  @ApiOperation({ summary: 'Create referral' })
  createReferral(@Body() body: any) {
    return this.proxy.forward('lead', 'POST', '/referrals', body);
  }
}
