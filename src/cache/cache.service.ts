import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';

import { GameDto } from './dto';

@Injectable()
export class CacheService {
  private readonly client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }

  async startGame(game: GameDto) {
    try {
      await this.client.connect();
      await this.client.json.set(`game_${game.gameId}`, '.', {
        game: JSON.stringify(game),
      });

      await this.client.quit();
    } catch (e) {
      console.log(e);
    }
  }
}
