import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProxyService } from '../services/proxy.service';

import { AuthGuard } from '../auth/auth.guard';

@ApiTags('customers')
@Controller('api/customers')
@UseGuards(AuthGuard)
export class CustomersController {
  constructor(private readonly proxy: ProxyService) {}

  @Get()
  @ApiOperation({ summary: 'List all customers' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'List of customers' })
  findAll(@Query() query: any) {
    return this.proxy.forward('crm', 'GET', '/customers', undefined, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer details' })
  findOne(@Param('id') id: string) {
    return this.proxy.forward('crm', 'GET', `/customers/${id}`);
  }

  @Post()
  @ApiOperation({ summary: 'Register new customer' })
  @ApiResponse({ status: 201, description: 'Customer created' })
  create(@Body() body: any) {
    return this.proxy.forward('crm', 'POST', '/customers', body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('crm', 'PUT', `/customers/${id}`, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer' })
  delete(@Param('id') id: string) {
    return this.proxy.forward('crm', 'DELETE', `/customers/${id}`);
  }

  @Post(':id/interests')
  @ApiOperation({ summary: 'Add vehicle interest for customer' })
  addInterest(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('crm', 'POST', `/customers/${id}/interests`, body);
  }

  @Get(':id/interests')
  @ApiOperation({ summary: 'Get customer vehicle interests' })
  getInterests(@Param('id') id: string) {
    return this.proxy.forward('crm', 'GET', `/customers/${id}/interests`);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Attach a document to a customer record' })
  addDocument(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('crm', 'POST', `/customers/${id}/documents`, body);
  }

  @Get(':id/documents')
  @ApiOperation({ summary: 'List documents attached to a customer record' })
  getDocuments(@Param('id') id: string) {
    return this.proxy.forward('crm', 'GET', `/customers/${id}/documents`);
  }

  @Post('loan-applications')
  @ApiOperation({ summary: 'Submit loan application' })
  submitLoan(@Body() body: any) {
    return this.proxy.forward('crm', 'POST', '/loan-applications', body);
  }

  @Get('loan-applications/all')
  @ApiOperation({ summary: 'List all loan applications' })
  getLoanApplications(@Query() query: any) {
    return this.proxy.forward('crm', 'GET', '/loan-applications', undefined, query);
  }

  @Get('loan-applications/:id')
  @ApiOperation({ summary: 'Track loan application' })
  trackLoan(@Param('id') id: string) {
    return this.proxy.forward('crm', 'GET', `/loan-applications/${id}`);
  }
}

