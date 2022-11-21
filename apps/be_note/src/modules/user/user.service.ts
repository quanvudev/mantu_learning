import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { Auth } from '../auth/entities/auth.entity';
import { Note } from '../note/entities/note.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
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

  findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOne(id: number) {
    return {
      status: true,
      data: await this.findById(id),
    };
  }

  async findMyNote(id: number, options: IPaginationOptions) {
    return paginate(this.notesRepository, options, {
      where: {
        user: {
          id,
        },
      },
      order: {
        createdAt: {
          direction: 'DESC',
        },
      },
    });
  }
}
