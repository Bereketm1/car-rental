import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { LoanReview } from './loan-review.entity';

@Entity('financial_institutions')
export class FinancialInstitution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  type: string;

  @Column({ name: 'contact_person', nullable: true })
  contactPerson: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'interest_rate_min', nullable: true })
  interestRateMin: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'interest_rate_max', nullable: true })
  interestRateMax: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'interest_rate', nullable: true })
  interestRate: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'max_loan_amount', nullable: true })
  maxLoanAmount: number;

  @Column({ name: 'max_term', nullable: true })
  maxTerm: number;

  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => LoanReview, (review: LoanReview) => review.institutionRef)
  loanReviews: LoanReview[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
