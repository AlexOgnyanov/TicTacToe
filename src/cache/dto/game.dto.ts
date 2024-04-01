import { RedisUserDto } from './redis-user.dto';

export class GameDto {
  gameId: number;
  user1: RedisUserDto;
  user2: RedisUserDto;
  game: number[];
}
