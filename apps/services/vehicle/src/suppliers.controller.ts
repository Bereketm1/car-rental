import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';

@ApiTags('suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly service: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'List all suppliers' })
  findAll(@Query() query: any) { return this.service.findAllSuppliers(query); }

  @Post()
  @ApiOperation({ summary: 'Register new supplier' })
  create(@Body() dto: any) { return this.service.createSupplier(dto); }
}
