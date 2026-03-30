import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Partner } from './partner.entity';

@Entity('agreements')
export class Agreement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'partner_id' })
  partnerId: string;

  @ManyToOne(() => Partner, (partner: Partner) => partner.agreements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @Column()
  title: string;

  @Column({ type: 'text' })
  terms: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
