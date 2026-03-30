import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FinanceService } from './finance.service';

@ApiTags('reviews')
@Controller()
export class FinanceController {
  constructor(private readonly service: FinanceService) {}

  @Get('reviews')
  @ApiOperation({ summary: 'List all loan reviews' })
  findAll(@Query() query: any) { return this.service.findAllReviews(query); }

  @Get('reviews/:id')
  @ApiOperation({ summary: 'Get loan review by ID' })
  findOne(@Param('id') id: string) { return this.service.findOneReview(id); }

  @Post('reviews')
  @ApiOperation({ summary: 'Create loan review' })
  create(@Body() dto: any) { return this.service.createReview(dto); }

  @Put('reviews/:id')
  @ApiOperation({ summary: 'Update loan review' })
  update(@Param('id') id: string, @Body() dto: any) { return this.service.updateReview(id, dto); }

  @Post('reviews/:id/approve')
  @ApiOperation({ summary: 'Approve financing' })
  approve(@Param('id') id: string, @Body() dto: any) { return this.service.approveReview(id, dto); }

  @Post('reviews/:id/reject')
  @ApiOperation({ summary: 'Reject financing' })
  reject(@Param('id') id: string, @Body() dto: any) { return this.service.rejectReview(id, dto); }

  @Post('document-requests')
  @ApiOperation({ summary: 'Request additional documents' })
  requestDocs(@Body() dto: any) { return this.service.createDocumentRequest(dto); }

  @Get('institutions')
  @ApiOperation({ summary: 'List financial institutions' })
  getInstitutions() { return this.service.findAllInstitutions(); }

  @Post('institutions')
  @ApiOperation({ summary: 'Register financial institution' })
  createInstitution(@Body() dto: any) { return this.service.createInstitution(dto); }

  @Get('pipeline')
  @ApiOperation({ summary: 'Get loan pipeline overview' })
  getPipeline() { return this.service.getPipeline(); }
}
