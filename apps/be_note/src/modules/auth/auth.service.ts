import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import head from 'lodash/head';
import pick from 'lodash/pick';
import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { AttemptAuthDto } from './dto/attempt-auth.dto';
import { SignUpDto } from './dto/signup-auth.dto';
import { Auth } from './entities/auth.entity';

const saltRound = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {
    //
  }
  async attempt(payload: AttemptAuthDto) {
    const auth = await this.authRepository.findOne({
      where: {
        username: payload.username,
      },
      relations: {
        users: true,
      },
    });
    if (!auth)
      return new HttpException('Could not found', HttpStatus.NOT_FOUND);

    const isValid = await bcrypt.compare(payload.password, auth.password);

    if (!isValid)
      return new HttpException(
        'Password does not match',
        HttpStatus.BAD_REQUEST,
      );

    const user = head(auth.users);

    return {
      accessToken: this.jwtService.sign({ id: user.id }),
      data: pick(user, ['id', 'name']),
    };
  }

  async signUp(payload: SignUpDto) {
    let auth = await this.authRepository.findOne({
      where: {
        username: payload.username,
      },
    });

    if (auth) return new HttpException('User is exist', HttpStatus.CONFLICT);
    const hashPass = await bcrypt.hash(payload.password, saltRound);

    auth = await this.authRepository.save({
      username: payload.username,
      password: hashPass,
    });

    if (!auth.id)
      return new HttpException('User could not create', HttpStatus.CONFLICT);

    const user = await this.userService.create(
      {
        name: payload.name,
        authId: auth.id,
      },
      auth,
    );

    auth.users = [user];

    await this.authRepository.save(auth);

    return {
      accessToken: this.jwtService.sign({ id: user.id }),
      data: pick(user, ['id', 'name']),
    };
  }
}
