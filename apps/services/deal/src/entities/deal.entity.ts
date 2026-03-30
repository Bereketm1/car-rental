import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @Column({ name: 'customer_name', nullable: true })
  customerName: string;

  @Column({ name: 'vehicle_id', nullable: true })
  vehicleId: string;

  @Column({ name: 'vehicle_description', nullable: true })
  vehicleDescription: string;

  @Column({ name: 'application_id', nullable: true })
  applicationId: string;

  @Column({ name: 'review_id', nullable: true })
  reviewId: string;

  @Column({ default: 'inquiry' })
  stage: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount', nullable: true })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'down_payment', nullable: true })
  downPayment: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'financed_amount', nullable: true })
  financedAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  commission: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'commission_rate', default: 5.00 })
  commissionRate: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
