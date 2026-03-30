import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from './customer.entity';
import { Document } from './document.entity';

@Entity('loan_applications')
export class LoanApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, (customer: Customer) => customer.loanApplications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'vehicle_id' })
  vehicleId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'requested_amount' })
  requestedAmount: number;

  @Column({ name: 'term_months' })
  termMonths: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'monthly_income' })
  monthlyIncome: number;

  @Column({ name: 'employment_status' })
  employmentStatus: string;

  @Column({ default: 'draft' })
  status: string;

  @OneToMany(() => Document, (doc: Document) => doc.loanApplication)
  documents: Document[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
