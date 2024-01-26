import { ApiProperty } from '@nestjs/swagger';
import { _MinLength, _IsNotEmpty } from '@/common/decorators';

export class PasswordResetDto {
  @ApiProperty()
  @_MinLength(8)
  @_IsNotEmpty()
  password: string;

  @ApiProperty()
  @_IsNotEmpty()
  confirmPassword: string;
}
