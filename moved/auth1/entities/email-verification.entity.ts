import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '@/users/entities';

@Entity('email_verification')
export class EmailVerificationEntity {
  @PrimaryColumn()
  token: string;

  @OneToOne(() => UserEntity, (user) => user.emailVerification, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;

  @Column({
    nullable: true,
  })
  emailToChange?: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
  })
  expiresAt: Date;
}
