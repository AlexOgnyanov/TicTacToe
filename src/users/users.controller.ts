import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUserDto } from '@/auth/dtos';
import { AuthGuard } from '@/auth/guards';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUserDto) {
    return await this.usersService.findOneOrFail(req.user.sub);
  }
}
