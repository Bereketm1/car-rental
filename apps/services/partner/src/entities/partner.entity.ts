import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Commission } from './commission.entity';
import { Agreement } from './agreement.entity';

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  type: string;

  @Column({ name: 'entity_id', nullable: true })
  entityId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  city: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'commission_rate', nullable: true })
  commissionRate: number;

  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => Commission, (commission: Commission) => commission.partner)
  commissions: Commission[];

  @OneToMany(() => Agreement, (agreement: Agreement) => agreement.partner)
  agreements: Agreement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
