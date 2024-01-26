import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserTypes } from '@/users/enums';
import {
  _IsEnum,
  _IsEmail,
  _IsString,
  _MinLength,
  _IsNotEmpty,
  _IsMobilePhone,
} from '@/common/decorators';

export class UserDto {
  @ApiProperty({
    enum: UserTypes,
  })
  @_IsEnum(UserTypes)
  @_IsNotEmpty()
  userType: UserTypes;

  @ApiProperty()
  @_IsEmail()
  email: string;

  @ApiProperty()
  @_IsString()
  @_IsNotEmpty()
  username: string;

  @ApiProperty()
  @_IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @_IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @_IsMobilePhone()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty()
  @_MinLength(8)
  @_IsNotEmpty()
  password: string;
}
