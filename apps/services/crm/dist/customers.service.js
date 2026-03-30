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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crypto_1 = require("crypto");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const vehicle_interest_entity_1 = require("./entities/vehicle-interest.entity");
let CustomersService = class CustomersService {
    constructor(customerRepo, interestRepo) {
        this.customerRepo = customerRepo;
        this.interestRepo = interestRepo;
    }
    async findAll(query) {
        let where = {};
        if (query?.search) {
            const s = `%${query.search}%`;
            where = [
                { firstName: (0, typeorm_2.Like)(s) },
                { lastName: (0, typeorm_2.Like)(s) },
                { email: (0, typeorm_2.Like)(s) },
            ];
        }
        const [data, total] = await this.customerRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
        });
        return { success: true, data, total };
    }
    async findOne(id) {
        const customer = await this.customerRepo.findOne({
            where: { id },
            relations: ['interests', 'loanApplications'],
        });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return { success: true, data: customer };
    }
    async create(dto) {
        const customer = this.customerRepo.create(dto);
        const saved = await this.customerRepo.save(customer);
        return { success: true, data: saved, message: 'Customer registered successfully' };
    }
    async update(id, dto) {
        const customer = await this.customerRepo.findOne({ where: { id } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        Object.assign(customer, dto);
        const saved = await this.customerRepo.save(customer);
        return { success: true, data: saved };
    }
    async delete(id) {
        const result = await this.customerRepo.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException('Customer not found');
        return { success: true, message: 'Customer deleted' };
    }
    async addInterest(customerId, dto) {
        const interest = this.interestRepo.create({
            customerId,
            ...dto,
        });
        const saved = await this.interestRepo.save(interest);
        return { success: true, data: saved };
    }
    async getInterests(customerId) {
        const interests = await this.interestRepo.find({
            where: { customerId },
            order: { createdAt: 'DESC' },
        });
        return { success: true, data: interests };
    }
    async addDocument(customerId, document) {
        const customer = await this.customerRepo.findOne({ where: { id: customerId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        const docs = customer.documents || [];
        const attachedDocument = {
            id: (0, crypto_1.randomUUID)(),
            ...document,
            uploadedAt: new Date(),
        };
        docs.push(attachedDocument);
        customer.documents = docs;
        await this.customerRepo.save(customer);
        return { success: true, data: attachedDocument, message: 'Document added to customer' };
    }
    async getDocuments(customerId) {
        const customer = await this.customerRepo.findOne({ where: { id: customerId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return { success: true, data: customer.documents || [] };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_interest_entity_1.VehicleInterest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CustomersService);
//# sourceMappingURL=customers.service.js.map