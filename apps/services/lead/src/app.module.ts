import { Module } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

import { Lead } from './entities/lead.entity';
import { Campaign } from './entities/campaign.entity';
import { Referral } from './entities/referral.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: join(process.cwd(), 'lead.sqlite'),
      autoSave: true,
      entities: [Lead, Campaign, Referral],
      synchronize: true, // Warning: true only for dev!
    }),
    TypeOrmModule.forFeature([Lead, Campaign, Referral]),
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class AppModule {}
