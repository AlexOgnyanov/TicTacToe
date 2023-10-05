import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos';
import { JwtAuthGuard } from '@/auth/guards';
import { RequestWithUserDto } from '@/auth/dtos';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiBody({ type: CreateUserDto })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiBody({ type: CreateUserDto })
  @UseGuards(JwtAuthGuard)
  @Post('/admin')
  async createAdminUser(
    @Req() req: RequestWithUserDto,
    @Body() createUserDto: CreateUserDto,
  ) {
    console.log(req.user);
    return this.usersService.create(createUserDto);
  }

  @Get(':username')
  async getUsers(@Query('username') username: string) {
    return await this.usersService.findOne(username);
  }
}
