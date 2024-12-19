import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({})
  price: number;

  @Column({})
  duration_days: number;

  @Column({ enum: ['unlimited_swipes', 'verified_badge'] })
  feature_type: string;

  @Column({ default: new Date() })
  created_at: Date;
}
