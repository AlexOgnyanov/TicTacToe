import {
  Req,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  SignInDto,
  SignUpDto,
  PasswordResetDto,
  PasswordChangeDto,
} from './dtos';

import { UserTypes } from '@/users/enums';
import { RequestWithUser } from '@/common/interfaces';
import {
  LocalAuthGuard,
  AccessTokenGuard,
  RefreshTokenGuard,
} from '@/common/guards';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: SignUpDto })
  @Post('signup/creators')
  async signUpCreators(@Body() dto: SignUpDto) {
    return await this.authService.signUp({
      ...dto,
      userType: UserTypes.Creator,
    });
  }

  @ApiBody({ type: SignUpDto })
  @Post('signup/customers')
  async signUpCustomers(@Body() dto: SignUpDto) {
    return await this.authService.signUp({
      ...dto,
      userType: UserTypes.Customer,
    });
  }

  @ApiBody({ type: SignInDto })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async signIn(@Req() request: RequestWithUser) {
    return await this.authService.createSession(
      request.user.id,
      request.user.type,
    );
  }

  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async logout(@Req() request: RequestWithUser) {
    request.res.setHeader('Authorization', null);
    return await this.authService.logout(request.user.sessionId);
  }

  @ApiBearerAuth('access-token')
  @Post('global-logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async globalLogout(@Req() request: RequestWithUser) {
    request.res.setHeader('Authorization', null);
    return await this.authService.globalLogout(request.user.id);
  }

  @ApiBearerAuth('refresh-token')
  @Post('token-refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(@Req() request: RequestWithUser) {
    return await this.authService.refreshTokens(request.user);
  }

  @ApiBody({ type: PasswordResetDto })
  @Patch('password-resets/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() dto: PasswordResetDto,
  ) {
    return await this.authService.resetPassword(dto, token);
  }

  @ApiBearerAuth('access-token')
  @ApiBody({ type: PasswordChangeDto })
  @Patch('passwords')
  @UseGuards(AccessTokenGuard)
  async passwordChange(
    @Req() request: RequestWithUser,
    @Body() dto: PasswordChangeDto,
  ) {
    return await this.authService.passwordChange(request.user, dto);
  }
}
