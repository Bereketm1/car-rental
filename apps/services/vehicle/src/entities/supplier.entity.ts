import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'contact_person' })
  contactPerson: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @Column()
  city: string;

  @Column({ name: 'license_number' })
  licenseNumber: string;

  @Column({ default: 'pending' })
  status: string;

  @OneToMany(() => Vehicle, (vehicle: Vehicle) => vehicle.supplier)
  vehicles: Vehicle[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
