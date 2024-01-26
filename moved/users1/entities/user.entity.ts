import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { UserTypeEntity } from './user-type.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserTypeEntity, { onDelete: 'SET NULL', eager: true })
  userType: UserTypeEntity;

  @Column({
    unique: true,
    nullable: true,
  })
  email?: string;

  @Column({
    unique: true,
    nullable: true,
  })
  username?: string;

  @Column({
    nullable: true,
  })
  firstName?: string;

  @Column({
    nullable: true,
  })
  lastName?: string;

  @Column({
    nullable: true,
  })
  phoneNumber?: string;

  @Exclude()
  @Column({
    nullable: true,
  })
  password?: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deletedAt: Date;
}
