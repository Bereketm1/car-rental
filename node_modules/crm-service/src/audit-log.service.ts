import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async findAll(query?: any) {
    const [data, total] = await this.auditRepo.findAndCount({
      order: { timestamp: 'DESC' },
      take: 50,
    });
    return { success: true, data, total };
  }

  async create(logData: any) {
    const log = this.auditRepo.create(logData);
    return this.auditRepo.save(log);
  }
}
