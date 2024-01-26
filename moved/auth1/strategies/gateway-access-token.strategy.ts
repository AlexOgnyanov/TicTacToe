import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ContextUser, AuthTokenPayload } from '@/common/interfaces';

@Injectable()
export class GatewayAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'gateway-jwt',
) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: AuthTokenPayload) {
    const user: ContextUser = {
      id: payload.sub,
      type: payload.userType,
      sessionId: payload.sessionId,
    };

    return user;
  }
}
