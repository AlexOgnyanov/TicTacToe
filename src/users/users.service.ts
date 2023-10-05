import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.usersRepository.create(dto);
    user.isAdmin = false;
    return this.usersRepository.save(user);
  }

  async createAdmin(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.usersRepository.create(dto);
    user.isAdmin = true;
    return this.usersRepository.save(user);
  }

  async findOne(username: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: {
        username,
      },
    });
  }
}
