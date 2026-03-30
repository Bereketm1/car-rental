import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PartnersService } from './partners.service';

@ApiTags('partners')
@Controller()
export class PartnersController {
  constructor(private readonly service: PartnersService) {}

  @Get('partners') 
  @ApiOperation({ summary: 'List all partners' })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get('partners/:id') 
  @ApiOperation({ summary: 'Get partner by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post('partners') 
  @ApiOperation({ summary: 'Create new partner' })
  create(@Body() dto: any) { return this.service.create(dto); }

  @Put('partners/:id') 
  @ApiOperation({ summary: 'Update partner' })
  update(@Param('id') id: string, @Body() dto: any) { return this.service.update(id, dto); }

  @Delete('partners/:id') 
  @ApiOperation({ summary: 'Remove partner' })
  delete(@Param('id') id: string) { return this.service.delete(id); }

  @Get('partners/:id/commissions') 
  @ApiOperation({ summary: 'Get partner commissions' })
  getCommissions(@Param('id') id: string) { return this.service.getCommissions(id); }

  @Post('partners/:id/commissions') 
  @ApiOperation({ summary: 'Record commission' })
  createCommission(@Param('id') id: string, @Body() dto: any) { return this.service.createCommission(id, dto); }

  @Get('agreements') 
  @ApiOperation({ summary: 'List all agreements' })
  findAllAgreements(@Query() query: any) { return this.service.findAllAgreements(query); }

  @Post('agreements') 
  @ApiOperation({ summary: 'Create new agreement' })
  createAgreement(@Body() dto: any) { return this.service.createAgreement(dto); }
}
