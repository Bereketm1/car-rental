"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
let VehiclesService = class VehiclesService {
    constructor(vehicleRepo, supplierRepo) {
        this.vehicleRepo = vehicleRepo;
        this.supplierRepo = supplierRepo;
    }
    // Vehicles
    async findAllVehicles(query) {
        let where = {};
        if (query?.make)
            where.make = (0, typeorm_2.Like)(`%${query.make}%`);
        if (query?.condition)
            where.condition = query.condition;
        if (query?.minPrice)
            where.price = (0, typeorm_2.MoreThanOrEqual)(Number(query.minPrice));
        if (query?.maxPrice)
            where.price = (0, typeorm_2.LessThanOrEqual)(Number(query.maxPrice));
        // Handle both min and max price together if both provided
        if (query?.minPrice && query?.maxPrice) {
            where.price = undefined;
            const qb = this.vehicleRepo.createQueryBuilder('vehicle');
            if (where.make)
                qb.andWhere('vehicle.make ILIKE :make', { make: `%${query.make}%` });
            if (where.condition)
                qb.andWhere('vehicle.condition = :condition', { condition: query.condition });
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
    async findOneVehicle(id) {
        const vehicle = await this.vehicleRepo.findOne({
            where: { id },
            relations: ['supplier'],
        });
        if (!vehicle)
            throw new common_1.NotFoundException('Vehicle not found');
        return { success: true, data: vehicle };
    }
    async createVehicle(dto) {
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
    async updateVehicle(id, dto) {
        const vehicle = await this.vehicleRepo.findOne({ where: { id } });
        if (!vehicle)
            throw new common_1.NotFoundException('Vehicle not found');
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
    async deleteVehicle(id) {
        const result = await this.vehicleRepo.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException('Vehicle not found');
        return { success: true, message: 'Vehicle deleted' };
    }
    // Suppliers
    async findAllSuppliers(query) {
        const [data, total] = await this.supplierRepo.findAndCount({
            order: { createdAt: 'DESC' },
        });
        return { success: true, data, total };
    }
    async createSupplier(dto) {
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
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], VehiclesService);
