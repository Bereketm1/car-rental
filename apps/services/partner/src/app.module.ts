import { Module } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';

import { Partner } from './entities/partner.entity';
import { Commission } from './entities/commission.entity';
import { Agreement } from './entities/agreement.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: join(process.cwd(), 'partner.sqlite'),
      autoSave: true,
      entities: [Partner, Commission, Agreement],
      synchronize: true, // Warning: true only for dev!
    }),
    TypeOrmModule.forFeature([Partner, Commission, Agreement]),
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
})
export class AppModule {}
