import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auth } from '../auth/entities/auth.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Auth)
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  async create(createUserDto: CreateUserDto, auth: Auth) {
    await this.usersRepository.insert(
      this.usersRepository.create({
        authId: createUserDto.authId,
        name: createUserDto.name,
        auth,
      }),
    );
    return this.usersRepository.findOne({
      where: {
        authId: createUserDto.authId,
        name: createUserDto.name,
      },
    });
  }

  async findOne(id: number) {
    return {
      status: true,
      data: await this.usersRepository.findOne({ where: { id } }),
    };
  }
}
