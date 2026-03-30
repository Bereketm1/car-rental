import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LoanReview } from './loan-review.entity';

@Entity('document_requests')
export class DocumentRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'review_id' })
  reviewId: string;

  @ManyToOne(() => LoanReview, (review: LoanReview) => review.documentRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review: LoanReview;

  @Column({ name: 'document_type' })
  documentType: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'requested' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
