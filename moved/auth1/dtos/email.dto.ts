import { ApiProperty } from '@nestjs/swagger';
import { _IsEmail, _IsNotEmpty } from '@/common/decorators';

export class EmailDto {
  @ApiProperty()
  @_IsEmail()
  @_IsNotEmpty()
  email: string;
}
