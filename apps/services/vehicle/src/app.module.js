"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const typeorm_1 = require("@nestjs/typeorm");
const vehicles_controller_1 = require("./vehicles.controller");
const suppliers_controller_1 = require("./suppliers.controller");
const inventory_controller_1 = require("./inventory.controller");
const vehicles_service_1 = require("./vehicles.service");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqljs',
                location: (0, path_1.join)(process.cwd(), 'vehicle.sqlite'),
                autoSave: true,
                entities: [vehicle_entity_1.Vehicle, supplier_entity_1.Supplier],
                synchronize: true, // Warning: true only for dev!
            }),
            typeorm_1.TypeOrmModule.forFeature([vehicle_entity_1.Vehicle, supplier_entity_1.Supplier]),
        ],
        controllers: [vehicles_controller_1.VehiclesController, suppliers_controller_1.SuppliersController, inventory_controller_1.InventoryController],
        providers: [vehicles_service_1.VehiclesService],
    })
], AppModule);
