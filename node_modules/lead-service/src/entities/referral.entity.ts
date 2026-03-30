import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'referrer_name' })
  referrerName: string;

  @Column({ name: 'referrer_email' })
  referrerEmail: string;

  @Column({ name: 'referred_name' })
  referredName: string;

  @Column({ name: 'referred_email' })
  referredEmail: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  reward: number;

  @Column({ name: 'reward_status', default: 'pending' })
  rewardStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
