import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
// import { Package } from '../packages/package.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  // @Column({ type: 'uuid' })
  // package_id: string;
  @Column({ enum: ['unlimited_swipes', 'verified_badge'] })
  package: string;

  @Column({})
  start_date: Date;

  @Column({})
  end_date: Date;

  @Column({ enum: ['active', 'expired'] })
  status: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // @ManyToOne(() => Package)
  // @JoinColumn({ name: 'package_id' })
  // package: Package;

  @Column({ default: new Date() })
  created_at: Date;
}
