import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProxyService } from '../services/proxy.service';

@ApiTags('finance')
@Controller('api/finance')
@UseGuards(AuthGuard)
export class FinanceController {
  constructor(private readonly proxy: ProxyService) {}

  @Get('reviews')
  @ApiOperation({ summary: 'List all loan reviews' })
  @ApiResponse({ status: 200, description: 'List of loan reviews' })
  findAll(@Query() query: any) {
    return this.proxy.forward('finance', 'GET', '/reviews', undefined, query);
  }

  @Get('reviews/:id')
  @ApiOperation({ summary: 'Get loan review by ID' })
  findOne(@Param('id') id: string) {
    return this.proxy.forward('finance', 'GET', `/reviews/${id}`);
  }

  @Post('reviews')
  @ApiOperation({ summary: 'Create loan review' })
  create(@Body() body: any) {
    return this.proxy.forward('finance', 'POST', '/reviews', body);
  }

  @Put('reviews/:id')
  @ApiOperation({ summary: 'Update loan review status' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('finance', 'PUT', `/reviews/${id}`, body);
  }

  @Post('reviews/:id/approve')
  @ApiOperation({ summary: 'Approve financing' })
  approve(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('finance', 'POST', `/reviews/${id}/approve`, body);
  }

  @Post('reviews/:id/reject')
  @ApiOperation({ summary: 'Reject financing' })
  reject(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('finance', 'POST', `/reviews/${id}/reject`, body);
  }

  @Post('document-requests')
  @ApiOperation({ summary: 'Request additional documents' })
  requestDocuments(@Body() body: any) {
    return this.proxy.forward('finance', 'POST', '/document-requests', body);
  }

  @Get('institutions')
  @ApiOperation({ summary: 'List financial institutions' })
  getInstitutions() {
    return this.proxy.forward('finance', 'GET', '/institutions');
  }

  @Post('institutions')
  @ApiOperation({ summary: 'Register financial institution' })
  createInstitution(@Body() body: any) {
    return this.proxy.forward('finance', 'POST', '/institutions', body);
  }

  @Get('pipeline')
  @ApiOperation({ summary: 'Get loan pipeline overview' })
  getPipeline() {
    return this.proxy.forward('finance', 'GET', '/pipeline');
  }
}
