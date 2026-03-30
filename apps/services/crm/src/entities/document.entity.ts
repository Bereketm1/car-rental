import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LoanApplication } from './loan-application.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'application_id' })
  applicationId: string;

  @ManyToOne(() => LoanApplication, (app: LoanApplication) => app.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' })
  loanApplication: LoanApplication;

  @Column()
  type: string;

  @Column()
  filename: string;

  @Column()
  url: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}
