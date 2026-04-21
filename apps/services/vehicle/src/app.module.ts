import { Module } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesController } from './vehicles.controller';
import { SuppliersController } from './suppliers.controller';
import { InventoryController } from './inventory.controller';
import { VehiclesService } from './vehicles.service';

import { Vehicle } from './entities/vehicle.entity';
import { Supplier } from './entities/supplier.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: join(process.cwd(), 'vehicle.sqlite'),
      autoSave: true,
      entities: [Vehicle, Supplier],
      synchronize: true, // Warning: true only for dev!
    }),
    TypeOrmModule.forFeature([Vehicle, Supplier]),
  ],
  controllers: [VehiclesController, SuppliersController, InventoryController],
  providers: [VehiclesService],
})
export class AppModule {}
