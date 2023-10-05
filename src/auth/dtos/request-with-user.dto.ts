import { ApiProperty } from '@nestjs/swagger';
import { ContextUser } from './context-user.dto';

export class RequestWithUserDto {
  @ApiProperty()
  user: ContextUser;
}
