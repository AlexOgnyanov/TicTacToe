import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import ms from 'ms';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { nanoid, customAlphabet } from 'nanoid';

import { UserDto } from '@/users/dtos';
import { UserTypes } from '@/users/enums';
import { UserEntity } from '@/users/entities';
import { UsersService } from '@/users/users.service';
import { AuthErrorCodes } from '@/1/errors';
import { ContextUser, UserAuthTokens } from '@/common/interfaces';
import { EmailVerificationTokenValidation } from '@/1/interfaces';
import { PasswordResetDto, PasswordChangeDto } from '@/1/dtos';
import {
  SessionEntity,
  PasswordResetEntity,
  EmailVerificationEntity,
} from '@/1/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    @InjectRepository(PasswordResetEntity)
    private readonly passwordResetRepository: Repository<PasswordResetEntity>,
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: Repository<EmailVerificationEntity>,
  ) {}

  public async validateToken(token: string) {
    return await this.jwtService.verify(token, {
      publicKey: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  public async signUp(dto: UserDto): Promise<void | UserAuthTokens> {
    const hashedPassword = await argon2.hash(dto.password);
    await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });
  }

  public async createSession(
    userId: number,
    userType: UserTypes,
  ): Promise<UserAuthTokens> {
    const sessionId = nanoid();
    const tokens = await this.generateTokens({
      id: userId,
      sessionId: sessionId,
      type: userType,
    });

    const expiresAt = new Date();
    const refreshTokenDuration = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );

    expiresAt.setMilliseconds(
      expiresAt.getMilliseconds() + ms(refreshTokenDuration),
    );

    const refreshToken = await argon2.hash(tokens.refreshToken);

    const newSession = this.sessionRepository.create({
      id: sessionId,
      user: { id: userId },
      expiresAt: expiresAt,
      refreshToken: refreshToken,
    });

    await this.sessionRepository.insert(newSession);

    return tokens;
  }

  async generateTokens(contextUser: ContextUser): Promise<UserAuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: contextUser.id,
          userType: contextUser.type,
          sessionId: contextUser.sessionId,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: contextUser.id,
          userType: contextUser.type,
          sessionId: contextUser.sessionId,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(contextUser: ContextUser): Promise<UserAuthTokens> {
    const tokens = await this.generateTokens(contextUser);

    const expiresAt = new Date();
    const refreshTokenDuration = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );

    expiresAt.setMilliseconds(
      expiresAt.getMilliseconds() + ms(refreshTokenDuration),
    );

    const refreshToken = await argon2.hash(tokens.refreshToken);

    await this.sessionRepository.update(contextUser.sessionId, {
      expiresAt: expiresAt,
      refreshToken: refreshToken,
    });

    return tokens;
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionRepository.delete(sessionId);
  }

  async globalLogout(userId: number): Promise<void> {
    await this.sessionRepository
      .createQueryBuilder()
      .delete()
      .where('user = :userId', { userId: userId })
      .execute();
  }

  async resetPassword(
    dto: PasswordResetDto,
    token: string,
  ): Promise<UserAuthTokens> {
    const passwordReset = await this.passwordResetRepository
      .createQueryBuilder('passwordReset')
      .select([
        'user.id',
        'user.userType',
        'userType.name',
        'passwordReset.expiresAt',
      ])
      .innerJoin('passwordReset.user', 'user')
      .innerJoin('user.userType', 'userType')
      .where('passwordReset.token = :token', { token: token })
      .getOne();

    if (!passwordReset) {
      throw new UnauthorizedException({
        errorCode: AuthErrorCodes.InvalidPasswordResetTokenError,
      });
    }

    const currentTime = new Date();
    const expiresAt = passwordReset.expiresAt;
    const diff = currentTime.getTime() - expiresAt.getTime();

    if (diff >= 0) {
      await this.passwordResetRepository.delete(token);
      throw new UnauthorizedException({
        errorCode: AuthErrorCodes.InvalidPasswordResetTokenError,
      });
    }

    const userId = passwordReset.user.id;
    const userType = passwordReset.user.userType.name;

    const hashedPassword = await argon2.hash(dto.password);

    await this.usersRepository.update(userId, {
      password: hashedPassword,
    });

    await this.globalLogout(userId);

    await this.passwordResetRepository.delete(token);

    return await this.createSession(userId, userType);
  }

  async passwordChange(
    contextUser: ContextUser,
    dto: PasswordChangeDto,
  ): Promise<UserAuthTokens> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.email', 'user.password'])
      .where('user.id = :id', { id: contextUser.id })
      .getOneOrFail();

    const isOldPasswordMaching = await argon2.verify(
      user.password,
      dto.oldPassword,
    );

    if (!isOldPasswordMaching) {
      throw new BadRequestException({
        errorCode: AuthErrorCodes.OldPasswordNotMatchingError,
      });
    }

    const hashedPassword = await argon2.hash(dto.newPassword);

    await this.usersRepository.update(contextUser.id, {
      password: hashedPassword,
    });

    await this.sessionRepository
      .createQueryBuilder('session')
      .delete()
      .where('session.id != :sessionId', { sessionId: contextUser.sessionId })
      .execute();

    const tokens = await this.refreshTokens(contextUser);

    return tokens;
  }

  async createEmailVerificationToken(
    email: string,
    userId: number,
  ): Promise<string> {
    const alphabet = '0123456789';
    const customNanoid = customAlphabet(alphabet, 6);
    const token = customNanoid();

    const expiresAt = new Date();
    const tokenDuration = this.configService.get<string>(
      'EMAIL_VERIFICATION_TOKEN_EXPIRATION',
    );

    expiresAt.setMilliseconds(expiresAt.getMilliseconds() + ms(tokenDuration));

    await this.emailVerificationRepository.save({
      user: {
        id: userId,
      },
      token: token,
      expiresAt: expiresAt,
      emailToChange: email,
    });

    return token;
  }

  async isEmailVerificationTokenValid(
    token: string,
  ): Promise<EmailVerificationTokenValidation> {
    const emailVerification = await this.emailVerificationRepository
      .createQueryBuilder('emailVerification')
      .select([
        'user.id',
        'emailVerification.expiresAt',
        'emailVerification.emailToChange',
      ])
      .innerJoin('emailVerification.user', 'user')
      .where('emailVerification.token = :token', { token: token })
      .getOne();

    if (!emailVerification) {
      return {
        valid: false,
        userId: null,
        emailToChange: null,
      };
    }

    const currentTime = new Date();
    const expiresAt = emailVerification.expiresAt;
    const diff = currentTime.getTime() - expiresAt.getTime();

    await this.emailVerificationRepository.delete(token);

    if (diff >= 0) {
      return {
        valid: false,
        userId: emailVerification.user.id,
        emailToChange: emailVerification.emailToChange,
      };
    }

    return {
      valid: true,
      userId: emailVerification.user.id,
      emailToChange: emailVerification.emailToChange,
    };
  }
}
