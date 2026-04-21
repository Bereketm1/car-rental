import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  // Vehicles
  async findAllVehicles(query?: any) {
    let where: any = {};
    if (query?.make) where.make = Like(`%${query.make}%`);
    if (query?.condition) where.condition = query.condition;
    if (query?.minPrice) where.price = MoreThanOrEqual(Number(query.minPrice));
    if (query?.maxPrice) where.price = LessThanOrEqual(Number(query.maxPrice));
    
    // Handle both min and max price together if both provided
    if (query?.minPrice && query?.maxPrice) {
      where.price = undefined;
      const qb = this.vehicleRepo.createQueryBuilder('vehicle');
      if (where.make) qb.andWhere('vehicle.make ILIKE :make', { make: `%${query.make}%` });
      if (where.condition) qb.andWhere('vehicle.condition = :condition', { condition: query.condition });
      qb.andWhere('vehicle.price >= :minPrice AND vehicle.price <= :maxPrice', {
        minPrice: Number(query.minPrice),
        maxPrice: Number(query.maxPrice),
      });
      const [data, total] = await qb.leftJoinAndSelect('vehicle.supplier', 'supplier').getManyAndCount();
      return { success: true, data, total };
    }

    const [data, total] = await this.vehicleRepo.findAndCount({
      where,
      relations: ['supplier'],
      order: { createdAt: 'DESC' },
    });
    return { success: true, data, total };
  }

  async findOneVehicle(id: string) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id },
      relations: ['supplier'],
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return { success: true, data: vehicle };
  }

  async createVehicle(dto: any) {
    let supplierName = dto.supplierName || '';

    if (dto.supplierId) {
      const supplier = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
      if (supplier) {
        supplierName = supplier.companyName;
      }
    }

    const vehicle = this.vehicleRepo.create({
      ...dto,
      supplierName,
      status: dto.status || 'available',
    });
    const saved = await this.vehicleRepo.save(vehicle);
    return { success: true, data: saved, message: 'Vehicle registered' };
  }

  async updateVehicle(id: string, dto: any) {
    const vehicle = await this.vehicleRepo.findOne({ where: { id } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    if (dto.supplierId) {
      const supplier = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
      if (supplier) {
        dto.supplierName = supplier.companyName;
      }
    }

    Object.assign(vehicle, dto);
    const saved = await this.vehicleRepo.save(vehicle);
    return { success: true, data: saved };
  }

  async deleteVehicle(id: string) {
    const result = await this.vehicleRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Vehicle not found');
    return { success: true, message: 'Vehicle deleted' };
  }

  // Suppliers
  async findAllSuppliers(query?: any) {
    const [data, total] = await this.supplierRepo.findAndCount({
      order: { createdAt: 'DESC' },
    });
    return { success: true, data, total };
  }

  async createSupplier(dto: any) {
    const supplier = this.supplierRepo.create({
      ...dto,
      status: 'active',
    });
    const saved = await this.supplierRepo.save(supplier);
    return { success: true, data: saved };
  }

  // Inventory
  async getInventorySummary() {
    const total = await this.vehicleRepo.count();
    const available = await this.vehicleRepo.count({ where: { status: 'available' } });
    const reserved = await this.vehicleRepo.count({ where: { status: 'reserved' } });
    const sold = await this.vehicleRepo.count({ where: { status: 'sold' } });
    
    // Group by make manually or via query builder
    const makeCounts = await this.vehicleRepo
      .createQueryBuilder('vehicle')
      .select('vehicle.make', 'make')
      .addSelect('COUNT(vehicle.id)', 'count')
      .groupBy('vehicle.make')
      .getRawMany();
      
    const byMake = makeCounts.reduce((acc, row) => {
      acc[row.make] = Number(row.count);
      return acc;
    }, {});

    return { success: true, data: { total, available, reserved, sold, byMake } };
  }
}
