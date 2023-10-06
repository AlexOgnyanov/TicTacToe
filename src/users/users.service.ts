import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupDto } from '@/auth/dtos';
import { UserErrorCodes } from './errors/user-errors.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async saveOrFail(user: UserEntity): Promise<UserEntity> {
    try {
      return this.usersRepository.save(user);
    } catch (e) {
      console.log(e);
    }
  }

  async create(dto: SignupDto): Promise<UserEntity> {
    if (await this.findOneByEmail(dto.email)) {
      throw new BadRequestException(UserErrorCodes.EmailAlreadyExistsError);
    }

    if (await this.findOneByUsername(dto.username)) {
      throw new BadRequestException(UserErrorCodes.UsernameAlreadyExistsError);
    }

    const user = this.usersRepository.create(dto);
    user.isAdmin = false;
    return await this.saveOrFail(user);
  }

  async createAdmin(dto: SignupDto): Promise<UserEntity> {
    if (await this.findOneByEmail(dto.email)) {
      throw new BadRequestException(UserErrorCodes.EmailAlreadyExistsError);
    }

    if (await this.findOneByUsername(dto.username)) {
      throw new BadRequestException(UserErrorCodes.UsernameAlreadyExistsError);
    }

    const user = this.usersRepository.create(dto);
    user.isAdmin = true;
    return await this.saveOrFail(user);
  }

  async findOne(id: number): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneOrFail(id: number): Promise<UserEntity> {
    const user = this.findOne(id);
    if (!user) {
      throw new BadRequestException(UserErrorCodes.NotFoundError);
    }

    return user;
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
