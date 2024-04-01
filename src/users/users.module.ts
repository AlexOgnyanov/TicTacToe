import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities';

import { GameEntity } from '@/games/entities';
import { CacheModule } from '@/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, GameEntity]), CacheModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
