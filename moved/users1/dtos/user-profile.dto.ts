import { OmitType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class UserProfileDto extends OmitType(UserDto, [
  'userType',
  'email',
  'password',
] as const) {}
