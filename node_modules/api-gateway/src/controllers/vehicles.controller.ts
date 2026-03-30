import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProxyService } from '../services/proxy.service';

@ApiTags('vehicles')
@Controller('api/vehicles')
@UseGuards(AuthGuard)
export class VehiclesController {
  constructor(private readonly proxy: ProxyService) {}

  @Get()
  @ApiOperation({ summary: 'List all vehicles' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'make', required: false })
  @ApiQuery({ name: 'condition', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiResponse({ status: 200, description: 'List of vehicles' })
  findAll(@Query() query: any) {
    return this.proxy.forward('vehicle', 'GET', '/vehicles', undefined, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  findOne(@Param('id') id: string) {
    return this.proxy.forward('vehicle', 'GET', `/vehicles/${id}`);
  }

  @Post()
  @ApiOperation({ summary: 'Register new vehicle' })
  @ApiResponse({ status: 201, description: 'Vehicle registered' })
  create(@Body() body: any) {
    return this.proxy.forward('vehicle', 'POST', '/vehicles', body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vehicle details' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.proxy.forward('vehicle', 'PUT', `/vehicles/${id}`, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vehicle' })
  delete(@Param('id') id: string) {
    return this.proxy.forward('vehicle', 'DELETE', `/vehicles/${id}`);
  }

  @Get('suppliers/all')
  @ApiOperation({ summary: 'List all suppliers' })
  getSuppliers(@Query() query: any) {
    return this.proxy.forward('vehicle', 'GET', '/suppliers', undefined, query);
  }

  @Post('suppliers')
  @ApiOperation({ summary: 'Register new supplier' })
  createSupplier(@Body() body: any) {
    return this.proxy.forward('vehicle', 'POST', '/suppliers', body);
  }

  @Get('inventory/summary')
  @ApiOperation({ summary: 'Get inventory summary' })
  getInventory() {
    return this.proxy.forward('vehicle', 'GET', '/inventory/summary');
  }
}
