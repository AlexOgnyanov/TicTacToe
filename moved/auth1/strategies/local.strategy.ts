import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { Strategy } from 'passport-local';

import { UserEntity } from '@/users/entities';
import { AuthErrorCodes } from '@/1/errors';
import { ContextUser } from '@/common/interfaces';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.password',
        'user.isEmailVerified',
        'userType.name',
      ])
      .innerJoin('user.userType', 'userType')
      .where('user.email = :email', { email: email })
      .getOne();

    if (user) {
      const isPasswordMatching = await argon2.verify(user.password, password);

      if (!isPasswordMatching) {
        throw new UnauthorizedException({
          errorCode: AuthErrorCodes.InvalidCredentialsError,
        });
      }

      if (!user.isEmailVerified) {
        throw new ForbiddenException({
          errorCode: AuthErrorCodes.EmailNotVerifiedError,
        });
      }

      const contextUser: ContextUser = {
        id: user.id,
        type: user.userType.name,
        sessionId: null,
      };

      return contextUser;
    }

    throw new UnauthorizedException({
      errorCode: AuthErrorCodes.InvalidCredentialsError,
    });
  }
}
