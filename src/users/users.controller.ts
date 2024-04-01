import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos';

import { AuthGuard } from '@/auth/guards';
import { RequestWithUserDto } from '@/auth/dtos';

@ApiTags('Users')
@ApiBearerAuth('AccessToken')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: RequestWithUserDto) {
    return await this.usersService.findOneOrFail(req.user.sub);
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return await this.usersService.findOneOrFail(id);
  }

  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  async updateUser(
    @Req() req: RequestWithUserDto,
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: number,
  ) {
    if (id !== req.user.sub && !req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Req() req: RequestWithUserDto, @Param('id') id: number) {
    if (id !== req.user.sub && !req.user.isAdmin) {
      throw new UnauthorizedException();
    }
    return await this.usersService.delete(id);
  }
}
