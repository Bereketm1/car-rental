import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';

import { FinancialInstitution } from './entities/financial-institution.entity';
import { LoanReview } from './entities/loan-review.entity';
import { DocumentRequest } from './entities/document-request.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER || 'merkato',
      password: process.env.POSTGRES_PASSWORD || 'merkatopassword',
      database: process.env.POSTGRES_DB || 'merkatomotors',
      entities: [FinancialInstitution, LoanReview, DocumentRequest],
      synchronize: true, // Warning: true only for dev!
    }),
    TypeOrmModule.forFeature([FinancialInstitution, LoanReview, DocumentRequest]),
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class AppModule {}
