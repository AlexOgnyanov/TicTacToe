// import { BadRequestException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import ShortUniqueId from 'short-unique-id';
// import { ConfigService } from '@nestjs/config';

// import { GameEntity } from './entities';
// import { GameState } from './enums';
// import { GameErrorCodes } from './errors';

// import { UsersService } from '@/users/users.service';
// import { CacheService } from '@/cache/cache.service';

// @Injectable()
export class GamesService {
  // constructor(
  //   @InjectRepository(GameEntity)
  //   private readonly gamesRepository: Repository<GameEntity>,
  //   private usersService: UsersService,
  //   private cacheService: CacheService,
  //   private configService: ConfigService,
  // ) {}
  // async findOneOrFail(id?: number, linkId?: string) {
  //   return await this.gamesRepository.findOne({
  //     relations: {
  //       user1: true,
  //       user2: true,
  //     },
  //     where: {
  //       id,
  //       linkId,
  //     },
  //   });
  // }
  // async findAll() {
  //   return await this.gamesRepository.find({
  //     relations: {
  //       user1: true,
  //       user2: true,
  //     },
  //   });
  // }
  // generateShortUUID(length: number): string {
  //   const uid = new ShortUniqueId({ length });
  //   return uid.rnd();
  // }
  // async create(userId: number): Promise<string> {
  //   const linkId = this.generateShortUUID(
  //     this.configService.get<number>('GAME_LINK_LENGTH'),
  //   );
  //   const game = this.gamesRepository.create({
  //     user1: {
  //       id: userId,
  //     },
  //     user2: null,
  //     linkId,
  //     state: GameState.Pending,
  //     outcome: null,
  //   });
  //   return (await this.gamesRepository.save(game)).linkId;
  // }
  // async joinGame(userId: number, gameId: string) {
  //   const game = await this.findOneOrFail(undefined, gameId);
  //   const user = await this.usersService.findOneOrFail(userId);
  //   if (game.user2) {
  //     throw new BadRequestException(GameErrorCodes.GameAlreadyAcceptedError);
  //   }
  //   game.user2 = user;
  //   game.state = GameState.InProgress;
  //   await this.gamesRepository.save(game);
  //   await this.cacheService.startGame({
  //     user1: game.user1,
  //     user2: user,
  //     gameId: game.id,
  //     game: Array<number>(9).fill(0),
  //   });
  // }
}
