import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';

import { Partner } from './entities/partner.entity';
import { Commission } from './entities/commission.entity';
import { Agreement } from './entities/agreement.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER || 'merkato',
      password: process.env.POSTGRES_PASSWORD || 'merkatopassword',
      database: process.env.POSTGRES_DB || 'merkatomotors',
      entities: [Partner, Commission, Agreement],
      synchronize: true, // Warning: true only for dev!
    }),
    TypeOrmModule.forFeature([Partner, Commission, Agreement]),
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
})
export class AppModule {}
