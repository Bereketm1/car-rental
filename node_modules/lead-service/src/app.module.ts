import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

import { Lead } from './entities/lead.entity';
import { Campaign } from './entities/campaign.entity';
import { Referral } from './entities/referral.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER || 'merkato',
      password: process.env.POSTGRES_PASSWORD || 'merkatopassword',
      database: process.env.POSTGRES_DB || 'merkatomotors',
      entities: [Lead, Campaign, Referral],
      synchronize: true, // Warning: true only for dev!
    }),
    TypeOrmModule.forFeature([Lead, Campaign, Referral]),
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class AppModule {}
