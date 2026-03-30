import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository, Like } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { VehicleInterest } from './entities/vehicle-interest.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(VehicleInterest)
    private readonly interestRepo: Repository<VehicleInterest>,
  ) {}

  async findAll(query?: any) {
    let where = {};
    if (query?.search) {
      const s = `%${query.search}%`;
      where = [
        { firstName: Like(s) },
        { lastName: Like(s) },
        { email: Like(s) },
      ];
    }
    const [data, total] = await this.customerRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
    });
    return { success: true, data, total };
  }

  async findOne(id: string) {
    const customer = await this.customerRepo.findOne({
      where: { id },
      relations: ['interests', 'loanApplications'],
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return { success: true, data: customer };
  }

  async create(dto: any) {
    const customer = this.customerRepo.create(dto);
    const saved = await this.customerRepo.save(customer);
    return { success: true, data: saved, message: 'Customer registered successfully' };
  }

  async update(id: string, dto: any) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    
    Object.assign(customer, dto);
    const saved = await this.customerRepo.save(customer);
    return { success: true, data: saved };
  }

  async delete(id: string) {
    const result = await this.customerRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Customer not found');
    return { success: true, message: 'Customer deleted' };
  }

  async addInterest(customerId: string, dto: any) {
    const interest = this.interestRepo.create({
      customerId,
      ...dto,
    });
    const saved = await this.interestRepo.save(interest);
    return { success: true, data: saved };
  }

  async getInterests(customerId: string) {
    const interests = await this.interestRepo.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
    return { success: true, data: interests };
  }

  async addDocument(customerId: string, document: any) {
    const customer = await this.customerRepo.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');
    
    const docs = customer.documents || [];
    const attachedDocument = {
      id: randomUUID(),
      ...document,
      uploadedAt: new Date(),
    };

    docs.push(attachedDocument);
    
    customer.documents = docs;
    await this.customerRepo.save(customer);
    return { success: true, data: attachedDocument, message: 'Document added to customer' };
  }

  async getDocuments(customerId: string) {
    const customer = await this.customerRepo.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');
    return { success: true, data: customer.documents || [] };
  }
}
