import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { UpdateUserDto } from './dtos';
import { UserErrorCodes } from './errors';
import { UserEntity } from './entities';

import { SignupDto } from '@/auth/dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async checkEmailAndUsernameOrFail(email?: string, username?: string) {
    if (email && (await this.findOneByEmail(email))) {
      throw new BadRequestException(UserErrorCodes.EmailAlreadyExistsError);
    }

    if (username && (await this.findOneByUsername(username))) {
      throw new BadRequestException(UserErrorCodes.UsernameAlreadyExistsError);
    }
  }

  async saveOrFail(user: UserEntity): Promise<UserEntity> {
    try {
      return this.usersRepository.save(user);
    } catch (e) {
      console.log(e);
    }
  }

  async create(dto: SignupDto): Promise<UserEntity> {
    await this.checkEmailAndUsernameOrFail(dto.email, dto.username);

    const user = this.usersRepository.create(dto);
    user.isAdmin = false;
    user.password = await argon2.hash(dto.password);
    return await this.saveOrFail(user);
  }

  async createAdmin(dto: SignupDto): Promise<UserEntity> {
    await this.checkEmailAndUsernameOrFail(dto.email, dto.username);

    const user = this.usersRepository.create(dto);
    user.isAdmin = true;
    user.password = await argon2.hash(dto.password);

    return await this.saveOrFail(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.checkEmailAndUsernameOrFail(dto.email, dto.username);

    const user = await this.findOneOrFail(id);
    return await this.usersRepository.update(user, dto);
  }

  async delete(id: number) {
    const user = await this.findOneOrFail(id);
    return await this.usersRepository.delete(user);
  }

  async findOne(id: number): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneOrFail(id: number): Promise<UserEntity> {
    const user = await this.findOne(id);

    if (!user) {
      throw new BadRequestException(UserErrorCodes.NotFoundError);
    }

    return user;
  }

  async findPendingGamesForUser(userId: number) {
    return this.usersRepository.findOne({
      relations: {
        gamesReceived: true,
      },
      where: {
        id: userId,
      },
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findOneByEmailOrFail(email: string): Promise<UserEntity> {
    const user = this.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException(UserErrorCodes.NotFoundError);
    }

    return user;
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: {
        username,
      },
    });
  }
}
