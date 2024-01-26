import { Entity, Column, PrimaryColumn } from 'typeorm';

import { UserTypes } from '@/users/enums';

@Entity('user_type')
export class UserTypeEntity {
  @PrimaryColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserTypes,
    default: UserTypes.User,
  })
  name: UserTypes;
}
