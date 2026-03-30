import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

import { AnalyticsSnapshot } from './entities/analytics-snapshot.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER || 'merkato',
      password: process.env.POSTGRES_PASSWORD || 'merkatopassword',
      database: process.env.POSTGRES_DB || 'merkatomotors',
      entities: [AnalyticsSnapshot],
      synchronize: true, // Warning: true only for dev!
    }),
    TypeOrmModule.forFeature([AnalyticsSnapshot]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AppModule {}
