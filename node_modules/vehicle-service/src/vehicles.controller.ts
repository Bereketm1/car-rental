import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly service: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'List all vehicles' })
  findAll(@Query() query: any) { return this.service.findAllVehicles(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  findOne(@Param('id') id: string) { return this.service.findOneVehicle(id); }

  @Post()
  @ApiOperation({ summary: 'Register new vehicle' })
  create(@Body() dto: any) { return this.service.createVehicle(dto); }

  @Put(':id')
  @ApiOperation({ summary: 'Update vehicle details' })
  update(@Param('id') id: string, @Body() dto: any) { return this.service.updateVehicle(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vehicle' })
  delete(@Param('id') id: string) { return this.service.deleteVehicle(id); }
}
