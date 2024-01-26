import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/users/users.module';
import {
  LocalStrategy,
  AccessTokenStrategy,
  RefreshTokenStrategy,
  GatewayAccessTokenStrategy,
} from './strategies';
import {
  SessionEntity,
  PasswordResetEntity,
  EmailVerificationEntity,
} from './entities';
import { UserEntity } from '@/users/entities';
import { SendgridModule } from '@/sendgrid/sendgrid.module';
import { NotificationsModule } from '@/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SessionEntity,
      PasswordResetEntity,
      EmailVerificationEntity,
    ]),
    JwtModule.register({}),
    PassportModule,
    UsersModule,
    SendgridModule,
    NotificationsModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GatewayAccessTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
