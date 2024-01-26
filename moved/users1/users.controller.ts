import { UseGuards, Controller, Delete, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { UsersService } from './users.service';

import { RequestWithUser } from '@/common/interfaces';
import { AccessTokenGuard } from '@/common/guards';

@ApiTags('User')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Delete('me')
  async softDeleteMe(@Req() request: RequestWithUser) {
    return await this.usersService.softDelete(request.user.id);
  }
}
