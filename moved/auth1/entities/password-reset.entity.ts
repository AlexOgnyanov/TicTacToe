import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '@/users/entities';

@Entity('password_reset')
export class PasswordResetEntity {
  @PrimaryColumn()
  token: string;

  @OneToOne(() => UserEntity, (user) => user.passwordReset, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
  })
  expiresAt: Date;
}
