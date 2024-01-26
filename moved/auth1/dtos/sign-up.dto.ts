import { OmitType } from '@nestjs/swagger';
import { UserDto } from '@/users/dtos';

export class SignUpDto extends OmitType(UserDto, ['userType'] as const) {}
