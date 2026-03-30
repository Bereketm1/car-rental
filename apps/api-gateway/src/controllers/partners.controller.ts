import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProxyService } from '../services/proxy.service';

@ApiTags('partners')
@Controller('api/partners')
@UseGuards(AuthGuard)
export class PartnersController {
  constructor(private readonly proxy: ProxyService) {}

  @Get()
  @ApiOperation({ summary: 'List all partners' })
  findAll(@Query() query: any) {
    return this.proxy.forward('partner', 'GET', '/partners', undefined, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get partner by ID' })
  findOne(@Param('id') id: string) {
    return this.proxy.forward('partner', 'GET', `/partners/${id}`);
  }

  @Post()
  @ApiOperation({ summary: 'Create new partner' })
  create(@Body() body: any) {
    return this.proxy.forward('partner', 'POST', '/partners', body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update partner' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('partner', 'PUT', `/partners/${id}`, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove partner' })
  delete(@Param('id') id: string) {
    return this.proxy.forward('partner', 'DELETE', `/partners/${id}`);
  }

  @Get(':id/commissions')
  @ApiOperation({ summary: 'Get partner commissions' })
  getCommissions(@Param('id') id: string) {
    return this.proxy.forward('partner', 'GET', `/partners/${id}/commissions`);
  }

  @Post(':id/commissions')
  @ApiOperation({ summary: 'Record commission for partner' })
  createCommission(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('partner', 'POST', `/partners/${id}/commissions`, body);
  }

  @Get('agreements/all')
  @ApiOperation({ summary: 'List all agreements' })
  getAgreements(@Query() query: any) {
    return this.proxy.forward('partner', 'GET', '/agreements', undefined, query);
  }

  @Post('agreements')
  @ApiOperation({ summary: 'Create new agreement' })
  createAgreement(@Body() body: any) {
    return this.proxy.forward('partner', 'POST', '/agreements', body);
  }
}
