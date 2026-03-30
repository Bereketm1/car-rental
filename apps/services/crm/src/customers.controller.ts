import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, CreateVehicleInterestDto } from './dto';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'List all customers' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Register new customer' })
  create(@Body() dto: CreateCustomerDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post(':id/interests')
  @ApiOperation({ summary: 'Add vehicle interest' })
  addInterest(@Param('id') id: string, @Body() dto: CreateVehicleInterestDto) {
    return this.service.addInterest(id, dto);
  }

  @Get(':id/interests')
  @ApiOperation({ summary: 'Get customer interests' })
  getInterests(@Param('id') id: string) {
    return this.service.getInterests(id);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Add document to customer' })
  addDocument(@Param('id') id: string, @Body() dto: any) {
    return this.service.addDocument(id, dto);
  }

  @Get(':id/documents')
  @ApiOperation({ summary: 'Get customer documents' })
  getDocuments(@Param('id') id: string) {
    return this.service.getDocuments(id);
  }
}
