import { UserTypes } from '@/users/enums';

export interface ContextUser {
  id: number;
  type: UserTypes;
  sessionId: string;
}
