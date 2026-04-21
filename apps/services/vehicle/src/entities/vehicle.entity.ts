import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Supplier } from './supplier.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'supplier_id', nullable: true })
  supplierId: string;

  @ManyToOne(() => Supplier, (supplier: Supplier) => supplier.vehicles, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'supplier_name', nullable: true })
  supplierName: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  color: string;

  @Column({ default: 0 })
  mileage: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ default: 'new' })
  condition: string;

  @Column({ name: 'fuel_type', nullable: true })
  fuelType: string;

  @Column({ nullable: true })
  transmission: string;

  @Column({ default: 'available' })
  status: string;

  @Column({ type: 'simple-json', nullable: true })
  images: string[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
