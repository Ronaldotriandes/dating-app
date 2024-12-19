import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: null })
  profile_picture: string;

  @Column({ enum: ['male', 'female'] })
  gender: string;

  @Column({ default: new Date() })
  created_at: Date;

  @Column({ default: false })
  is_verified: string;

  @Column({ default: new Date() })
  last_login: string;
}
