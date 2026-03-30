import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoanApplicationsService } from './loan-applications.service';
import { CreateLoanApplicationDto } from './dto';

@ApiTags('loan-applications')
@Controller('loan-applications')
export class LoanApplicationsController {
  constructor(private readonly service: LoanApplicationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all loan applications' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loan application by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Submit loan application' })
  create(@Body() dto: CreateLoanApplicationDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update loan application' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }
}
