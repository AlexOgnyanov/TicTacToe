import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ShortUniqueId from 'short-unique-id';
import { ConfigService } from '@nestjs/config';

import { GameEntity } from './entities';
import { GameState } from './enums';
import { GameErrorCodes } from './errors';

import { UsersService } from '@/users/users.service';
import { CacheService } from '@/cache/cache.service';
import { UserEntity } from '@/users/entities';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gamesRepository: Repository<GameEntity>,
    private usersService: UsersService,
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {}

  async findOneOrFail(id?: number, linkId?: string) {
    return await this.gamesRepository.findOne({
      relations: {
        user1: true,
        user2: true,
      },
      where: {
        id,
        linkId,
      },
    });
  }

  async findAll() {
    return await this.gamesRepository.find({
      relations: {
        user1: true,
        user2: true,
      },
    });
  }

  generateShortUUID(length: number): string {
    const uid = new ShortUniqueId({ length });
    return uid.rnd();
  }

  async create(userId: number): Promise<string> {
    const linkId = this.generateShortUUID(
      this.configService.get<number>('GAME_LINK_LENGTH'),
    );

    const game = this.gamesRepository.create({
      user1: {
        id: userId,
      },
      user2: null,
      linkId,
      state: GameState.Pending,
      outcome: null,
    });

    return (await this.gamesRepository.save(game)).linkId;
  }

  async doesUserHaveActiveGames(user: UserEntity) {
    return await this.gamesRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.user1', 'user1')
      .leftJoinAndSelect('game.user2', 'user2')
      .where('user1.id = :id OR user2.id = :id', {
        id: user.id,
      })
      .andWhere('game.state = :state', {
        state: GameState.InProgress,
      })
      .getCount();
  }

  async joinGame(userId: number, gameId: string) {
    const game = await this.findOneOrFail(undefined, gameId);
    const user = await this.usersService.findOneOrFail(userId);

    if (game.user1.id === userId) {
      throw new BadRequestException(GameErrorCodes.CannotJoinYourOwnGameError);
    }

    if (game.user2) {
      throw new BadRequestException(GameErrorCodes.GameAlreadyAcceptedError);
    }

    if (await this.doesUserHaveActiveGames(user)) {
      throw new BadRequestException(
        GameErrorCodes.CannotHaveMultipleActiveGamesError,
      );
    }

    game.user2 = user;
    game.state = GameState.InProgress;

    await this.gamesRepository.save(game);

    await this.cacheService.startGame({
      user1: game.user1,
      user2: user,
      gameId: game.id,
      game: Array<number>(9).fill(0),
    });
  }
}
