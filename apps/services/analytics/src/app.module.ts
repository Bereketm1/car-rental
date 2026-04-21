import { Module } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

import { AnalyticsSnapshot } from './entities/analytics-snapshot.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: join(process.cwd(), 'analytics.sqlite'),
      autoSave: true,
      entities: [AnalyticsSnapshot],
      synchronize: true, // Warning: true only for dev!
    }),
    TypeOrmModule.forFeature([AnalyticsSnapshot]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AppModule {}
