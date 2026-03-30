import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { FinancialInstitution } from './financial-institution.entity';
import { DocumentRequest } from './document-request.entity';

@Entity('loan_reviews')
export class LoanReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_id', nullable: true })
  applicationId: string;

  @Column({ name: 'deal_id', nullable: true })
  dealId: string;

  @Column({ name: 'institution_id', nullable: true })
  institutionId: string;

  @ManyToOne(() => FinancialInstitution, (institution: FinancialInstitution) => institution.loanReviews, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'institution_id' })
  institutionRef: FinancialInstitution;

  @Column({ nullable: true })
  institution: string;

  @Column({ name: 'customer_name', nullable: true })
  customerName: string;

  @Column({ name: 'vehicle_description', nullable: true })
  vehicleDescription: string;

  @Column({ name: 'reviewer_name', nullable: true })
  reviewerName: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'requested_amount', nullable: true })
  requestedAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'approved_amount', nullable: true })
  approvedAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'interest_rate', nullable: true })
  interestRate: number;

  @Column({ nullable: true })
  term: number;

  @Column({ name: 'term_months', nullable: true })
  termMonths: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => DocumentRequest, (req: DocumentRequest) => req.review)
  documentRequests: DocumentRequest[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
