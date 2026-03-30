import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeadsService } from './leads.service';

@ApiTags('leads')
@Controller()
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Get('leads') 
  @ApiOperation({ summary: 'List all leads' })
  findAll(@Query() query: any) { return this.service.findAllLeads(query); }

  @Get('leads/:id') 
  @ApiOperation({ summary: 'Get lead by ID' })
  findOne(@Param('id') id: string) { return this.service.findOneLead(id); }

  @Post('leads') 
  @ApiOperation({ summary: 'Capture new lead' })
  create(@Body() dto: any) { return this.service.createLead(dto); }

  @Put('leads/:id') 
  @ApiOperation({ summary: 'Update lead' })
  update(@Param('id') id: string, @Body() dto: any) { return this.service.updateLead(id, dto); }

  @Delete('leads/:id') 
  @ApiOperation({ summary: 'Delete lead' })
  delete(@Param('id') id: string) { return this.service.deleteLead(id); }

  @Get('campaigns') 
  @ApiOperation({ summary: 'List all campaigns' })
  getCampaigns(@Query() query: any) { return this.service.findAllCampaigns(query); }

  @Post('campaigns') 
  @ApiOperation({ summary: 'Create new campaign' })
  createCampaign(@Body() dto: any) { return this.service.createCampaign(dto); }

  @Put('campaigns/:id') 
  @ApiOperation({ summary: 'Update campaign' })
  updateCampaign(@Param('id') id: string, @Body() dto: any) { return this.service.updateCampaign(id, dto); }

  @Get('referrals') 
  @ApiOperation({ summary: 'List all referrals' })
  getReferrals(@Query() query: any) { return this.service.findAllReferrals(query); }

  @Post('referrals') 
  @ApiOperation({ summary: 'Create referral' })
  createReferral(@Body() dto: any) { return this.service.createReferral(dto); }
}
