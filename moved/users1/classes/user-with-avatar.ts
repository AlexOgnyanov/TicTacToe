import { OmitType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';

import { UserEntity } from '../entities';

export class UserWithAvatar extends OmitType(UserEntity, [
  'password',
  'phoneNumber',
] as const) {
  @Exclude()
  password: string;

  @Exclude()
  phoneNumber: string;
}
