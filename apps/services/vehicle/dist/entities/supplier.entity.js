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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supplier = void 0;
const typeorm_1 = require("typeorm");
const vehicle_entity_1 = require("./vehicle.entity");
let Supplier = class Supplier {
};
exports.Supplier = Supplier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Supplier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_name' }),
    __metadata("design:type", String)
], Supplier.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_person' }),
    __metadata("design:type", String)
], Supplier.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Supplier.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Supplier.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Supplier.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Supplier.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'license_number' }),
    __metadata("design:type", String)
], Supplier.prototype, "licenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Supplier.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vehicle_entity_1.Vehicle, (vehicle) => vehicle.supplier),
    __metadata("design:type", Array)
], Supplier.prototype, "vehicles", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Supplier.prototype, "createdAt", void 0);
exports.Supplier = Supplier = __decorate([
    (0, typeorm_1.Entity)('suppliers')
], Supplier);
//# sourceMappingURL=supplier.entity.js.map