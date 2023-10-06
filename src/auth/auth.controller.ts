import { Body, Controller, Post, UseGuards, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dtos';
import { AdminAuthGuard } from './guards';

import { UsersService } from '@/users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.usersService.create(dto);
  }

  @Post('login')
  async signIn(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.signIn(
      dto.username,
      dto.password,
    );
    res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .sendStatus(200);
  }

  @UseGuards(AdminAuthGuard)
  @Post('admin/signup')
  async adminSignup(@Body() dto: SignupDto) {
    return this.usersService.createAdmin(dto);
  }
}
