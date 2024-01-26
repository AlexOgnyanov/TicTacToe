import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import * as argon2 from 'argon2';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthErrorCodes } from '@/1/errors';
import { SessionEntity } from '@/1/entities';
import { ContextUser } from '@/common/interfaces';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    readonly configService: ConfigService,
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const session = await this.sessionsRepository
      .createQueryBuilder('session')
      .select('session.refreshToken')
      .where('session.id = :sessionId', {
        sessionId: payload.sessionId,
      })
      .getOne();

    if (!session) {
      throw new UnauthorizedException({
        errorCode: AuthErrorCodes.InvalidRefreshTokenError,
      });
    }

    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

    // Token reuse detection:
    // Check if the request's refresh token matches the one from the user's session
    // If not, the session is being deleted thus both users are being redirected to the login screen

    const isRefreshTokensMatching = await argon2.verify(
      session.refreshToken,
      refreshToken,
    );

    if (!isRefreshTokensMatching) {
      await this.sessionsRepository.delete(payload.sessionId);
      throw new UnauthorizedException({
        errorCode: AuthErrorCodes.InvalidRefreshTokenError,
      });
    }

    // Check if the token expired
    // getTime() returns the time in miliseconds while payload.exp is in seconds
    // therefore division by 1000 is necessary

    const currentTime = new Date();

    if (payload.exp < currentTime.getTime() / 1000) {
      await this.sessionsRepository.delete(payload.sessionId);
      throw new UnauthorizedException({
        errorCode: AuthErrorCodes.InvalidRefreshTokenError,
      });
    }

    const user: ContextUser = {
      id: payload.sub,
      type: payload.userType,
      sessionId: payload.sessionId,
    };

    return user;
  }
}
