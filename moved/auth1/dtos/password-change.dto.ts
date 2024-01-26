import { ApiProperty } from '@nestjs/swagger';
import { _IsString, _MinLength, _IsNotEmpty } from '@/common/decorators';

export class PasswordChangeDto {
  @ApiProperty()
  @_IsString()
  @_IsNotEmpty()
  oldPassword: string;

  @ApiProperty()
  @_MinLength(8)
  @_IsNotEmpty()
  newPassword: string;

  @ApiProperty()
  @_IsNotEmpty()
  confirmNewPassword: string;
}
