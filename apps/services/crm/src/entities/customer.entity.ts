import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { VehicleInterest } from './vehicle-interest.entity';
import { LoanApplication } from './loan-application.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ name: 'national_id', nullable: true })
  nationalId: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  documents: any[];

  @OneToMany(() => VehicleInterest, (interest: VehicleInterest) => interest.customer)
  interests: VehicleInterest[];

  @OneToMany(() => LoanApplication, (app: LoanApplication) => app.customer)
  loanApplications: LoanApplication[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
