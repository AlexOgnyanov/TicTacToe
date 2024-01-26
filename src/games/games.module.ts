import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import { GamesService } from './games.service';
// import { GamesController } from './games.controller';
// import { GameEntity } from './entities';

// import { UsersModule } from '@/users/users.module';
// import { UserEntity } from '@/users/entities';
// import { CacheModule } from '@/cache/cache.module';

@Module({
  // imports: [
  //   TypeOrmModule.forFeature([UserEntity, GameEntity]),
  //   UsersModule,
  //   CacheModule,
  // ],
  // controllers: [GamesController],
  // providers: [GamesService],
  // exports: [GamesService],
})
export class GamesModule {}
