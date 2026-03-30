import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Lead } from './lead.entity';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budget: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  spent: number;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'draft' })
  status: string;

  @Column({ name: 'leads_generated', default: 0 })
  leadsGenerated: number;

  @Column({ default: 0 })
  conversions: number;

  @OneToMany(() => Lead, (lead: Lead) => lead.campaign)
  leads: Lead[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
