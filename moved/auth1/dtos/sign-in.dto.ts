import { ApiProperty } from '@nestjs/swagger';
import { _IsEmail, _IsString, _IsNotEmpty } from '@/common/decorators';

export class SignInDto {
  @ApiProperty()
  @_IsEmail()
  @_IsNotEmpty()
  email: string;

  @ApiProperty()
  @_IsString()
  @_IsNotEmpty()
  password: string;
}
