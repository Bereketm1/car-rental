import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: VehiclesService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get inventory summary' })
  getSummary() { return this.service.getInventorySummary(); }
}
