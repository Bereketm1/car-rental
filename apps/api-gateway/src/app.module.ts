import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { CustomersController } from './controllers/customers.controller';
import { VehiclesController } from './controllers/vehicles.controller';
import { FinanceController } from './controllers/finance.controller';
import { DealsController } from './controllers/deals.controller';
import { PartnersController } from './controllers/partners.controller';
import { LeadsController } from './controllers/leads.controller';
import { AnalyticsController } from './controllers/analytics.controller';
import { SearchController } from './controllers/search.controller';
import { DocumentsController } from './controllers/documents.controller';
import { NotificationsController } from './controllers/notifications.controller';
import { AuditLogsController } from './controllers/audit-logs.controller';
import { ProxyService } from './services/proxy.service';
import { AuthModule } from './auth/auth.module';
import { AuditInterceptor } from './interceptors/audit.interceptor';

@Module({
  imports: [
    HttpModule,
    AuthModule,
  ],
  controllers: [
    CustomersController,
    VehiclesController,
    FinanceController,
    DealsController,
    PartnersController,
    LeadsController,
    AnalyticsController,
    SearchController,
    DocumentsController,
    NotificationsController,
    AuditLogsController,
  ],
  providers: [
    ProxyService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
