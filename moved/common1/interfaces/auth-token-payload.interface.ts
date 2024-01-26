import { UserTypes } from '@/users/enums';

export interface AuthTokenPayload {
  sub: number;
  sessionId: string;
  userType: UserTypes;
  exp: number;
  iat: number;
}
