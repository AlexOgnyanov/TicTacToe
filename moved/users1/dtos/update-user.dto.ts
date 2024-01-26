import { OmitType } from '@nestjs/swagger';

import { UserDto } from '@/users/dtos';

export class UpdateUserDto extends OmitType(UserDto, ['userType'] as const) {}
