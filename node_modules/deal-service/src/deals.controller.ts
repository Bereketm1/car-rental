import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DealsService } from './deals.service';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(private readonly service: DealsService) {}

  @Get()
  @ApiOperation({ summary: 'List all deals' })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get('stages/summary')
  @ApiOperation({ summary: 'Get deal stages summary' })
  getStagesSummary() { return this.service.getStagesSummary(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get deal by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create new deal' })
  create(@Body() dto: any) { return this.service.create(dto); }

  @Put(':id')
  @ApiOperation({ summary: 'Update deal' })
  update(@Param('id') id: string, @Body() dto: any) { return this.service.update(id, dto); }

  @Put(':id/stage')
  @ApiOperation({ summary: 'Update deal stage' })
  updateStage(@Param('id') id: string, @Body() dto: any) { return this.service.updateStage(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel deal' })
  delete(@Param('id') id: string) { return this.service.delete(id); }
}
