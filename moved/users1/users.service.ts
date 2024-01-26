import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Repository, Not, IsNull } from 'typeorm';

import { UserDto } from './dtos';
import { UserTypeEntity, UserEntity } from './entities';
import { UsersErrors } from './errors';

import { SessionEntity } from '@/1/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserTypeEntity)
    private readonly userTypesRepository: Repository<UserTypeEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async isExistByEmail(email: string): Promise<boolean> {
    const result = await this.usersRepository.query(
      'SELECT EXISTS (SELECT 1 FROM "user" WHERE "email" = $1)',
      [email],
    );

    return result[0].exists;
  }

  async isExistByUsername(username: string): Promise<boolean> {
    const result = await this.usersRepository.query(
      'SELECT EXISTS (SELECT 1 FROM "user" WHERE "username" = $1)',
      [username],
    );

    return result[0].exists;
  }

  async findAllUsers(query: PaginateQuery): Promise<Paginated<UserEntity>> {
    return await paginate(query, this.usersRepository, {
      relations: {
        userType: true,
      },
      sortableColumns: [
        'createdAt',
        'username',
        'email',
        'firstName',
        'lastName',
      ],
      searchableColumns: ['username', 'email', 'firstName', 'lastName'],
    });
  }

  async findOneUser(userId: number): Promise<Partial<UserEntity>> {
    const user = await this.usersRepository.findOneOrFail({
      where: {
        id: userId,
      },
    });

    return user;
  }

  async create(dto: UserDto): Promise<UserEntity> {
    await this.checkEmailOrFail(dto.email);
    await this.checkUsernameOrFail(dto.username);

    const userType = await this.userTypesRepository.findOneBy({
      name: dto.userType,
    });

    const user = this.usersRepository.create({
      ...dto,
      userType: userType,
    });

    return user;
  }

  async softDelete(id: number): Promise<void> {
    await this.usersRepository.update(id, {
      email: null,
      username: null,
      firstName: null,
      lastName: null,
      phoneNumber: null,
      password: null,
    });
    await this.usersRepository.softDelete(id);
  }

  async getUserTokens(userId: number) {
    const sessions = await this.sessionRepository.find({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: userId,
        },
        pushToken: Not(IsNull()),
      },
    });

    return sessions.map((session) => session.pushToken);
  }

  private generatePaginationObject(query: PaginateQuery): {
    skip: number;
    take: number;
  } {
    return { skip: (query.page - 1) * query.limit, take: query.limit };
  }

  private async checkUsernameOrFail(username: string): Promise<void> {
    const checkIfExistsByUsername = await this.isExistByUsername(username);

    if (checkIfExistsByUsername) {
      throw new BadRequestException({
        errorCode: UsersErrors.UsernameAlreadyTakenError,
      });
    }
  }

  private async checkEmailOrFail(email: string): Promise<void> {
    const checkIfExistsByEmail = await this.isExistByEmail(email);

    if (checkIfExistsByEmail) {
      throw new BadRequestException({
        errorCode: UsersErrors.EmailAlreadyTakenError,
      });
    }
  }
}
