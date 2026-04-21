import { Module } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { Deal } from './entities/deal.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: join(process.cwd(), 'deal.sqlite'),
      autoSave: true,
      entities: [Deal],
      synchronize: true, // Warning: true only for dev!
    }),
    TypeOrmModule.forFeature([Deal]),
  ],
  controllers: [DealsController],
  providers: [DealsService],
})
export class AppModule {}
