import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('analytics_snapshots')
export class AnalyticsSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'snapshot_date', type: 'date' })
  snapshotDate: Date;

  @Column({ type: 'jsonb' })
  data: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
