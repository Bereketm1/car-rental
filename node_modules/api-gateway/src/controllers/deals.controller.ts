import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProxyService } from '../services/proxy.service';

@ApiTags('deals')
@Controller('api/deals')
@UseGuards(AuthGuard)
export class DealsController {
  constructor(private readonly proxy: ProxyService) {}

  @Get()
  @ApiOperation({ summary: 'List all deals' })
  findAll(@Query() query: any) {
    return this.proxy.forward('deal', 'GET', '/deals', undefined, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deal by ID' })
  findOne(@Param('id') id: string) {
    return this.proxy.forward('deal', 'GET', `/deals/${id}`);
  }

  @Post()
  @ApiOperation({ summary: 'Create new deal' })
  create(@Body() body: any) {
    return this.proxy.forward('deal', 'POST', '/deals', body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update deal' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('deal', 'PUT', `/deals/${id}`, body);
  }

  @Put(':id/stage')
  @ApiOperation({ summary: 'Update deal stage' })
  updateStage(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('deal', 'PUT', `/deals/${id}/stage`, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel deal' })
  delete(@Param('id') id: string) {
    return this.proxy.forward('deal', 'DELETE', `/deals/${id}`);
  }

  @Get('stages/summary')
  @ApiOperation({ summary: 'Get deal stages summary' })
  getStagesSummary() {
    return this.proxy.forward('deal', 'GET', '/deals/stages/summary');
  }
}
