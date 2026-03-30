import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Partner } from './partner.entity';

@Entity('commissions')
export class Commission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'partner_id' })
  partnerId: string;

  @ManyToOne(() => Partner, (partner: Partner) => partner.commissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @Column({ name: 'deal_id' })
  dealId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
