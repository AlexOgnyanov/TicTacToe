import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';

import { GameOutcome, GameState } from '../enums';

import { UserEntity } from '@/users/entities';

@Entity('games')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user1) => user1.gamesSent)
  user1: UserEntity;

  @ManyToOne(() => UserEntity, (user2) => user2.gamesReceived, {
    nullable: true,
  })
  user2: UserEntity;

  @Column()
  linkId: string;

  @Column({ enum: GameOutcome, type: 'enum', nullable: true })
  outcome: GameOutcome;

  @Column({ enum: GameState, type: 'enum' })
  state: GameState;
}
