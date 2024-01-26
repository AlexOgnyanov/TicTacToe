import { _IsNotEmpty, _IsString } from '@/common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class PushTokenDto {
  @ApiProperty()
  @_IsNotEmpty()
  @_IsString()
  token: string;
}
