import { UserEntity } from '@/users/entities';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('session')
export class SessionEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    unique: true,
  })
  refreshToken: string;

  @Column({
    type: 'timestamptz',
  })
  expiresAt: Date;

  @Column({
    nullable: true,
  })
  pushToken?: string;

  @ManyToOne(() => UserEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: UserEntity;
}
