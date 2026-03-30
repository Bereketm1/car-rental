import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { LoanApplicationsController } from './loan-applications.controller';
import { CustomersService } from './customers.service';
import { LoanApplicationsService } from './loan-applications.service';

import { Customer } from './entities/customer.entity';
import { VehicleInterest } from './entities/vehicle-interest.entity';
import { LoanApplication } from './entities/loan-application.entity';
import { Document } from './entities/document.entity';
import { Notification } from './entities/notification.entity';
import { AuditLog } from './entities/audit-log.entity';

import { NotificationService } from './notifications.service';
import { NotificationController } from './notifications.controller';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER || 'merkato',
      password: process.env.POSTGRES_PASSWORD || 'merkatopassword',
      database: process.env.POSTGRES_DB || 'merkatomotors',
      entities: [Customer, VehicleInterest, LoanApplication, Document, Notification, AuditLog],
      synchronize: true, // Warning: true only for dev!
    }),
    TypeOrmModule.forFeature([Customer, VehicleInterest, LoanApplication, Document, Notification, AuditLog]),
  ],
  controllers: [CustomersController, LoanApplicationsController, NotificationController, AuditLogController],
  providers: [CustomersService, LoanApplicationsService, NotificationService, AuditLogService],
})
export class AppModule {}
