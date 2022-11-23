import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { first } from 'lodash';
import head from 'lodash/head';
import pick from 'lodash/pick';
import googleAuth from 'src/constants/google.auth';
import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { AttemptAuthDto } from './dto/attempt-auth.dto';
import { AttemptAuthWithProviderDto } from './dto/attempt-auth-with-provider.dto';
import { SignUpDto } from './dto/signup-auth.dto';
import { Auth, AuthProvider } from './entities/auth.entity';

const saltRound = 10;

interface GoogleOauthToken {
  access_token: string;
  id_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  scope: string;
}

interface GoogleOauthUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
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

  getGoogleToken(p: AttemptAuthWithProviderDto): Promise<GoogleOauthToken> {
    const url = `https://oauth2.googleapis.com/token`;
    const payload = {
      code: p.code,
      client_id: googleAuth.clientId,
      client_secret: googleAuth.clientSecret,
      redirect_uri: p.redirect_uri,
      grant_type: `authorization_code`,
    };

    return axios
      .post(url, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((r) => r.data);
  }

  getGoogleUser(
    idToken: string,
    accessToken: string,
  ): Promise<GoogleOauthUser> {
    return axios
      .get<GoogleOauthUser>(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      )
      .then((r) => r.data);
  }

  async auth0(payload: AttemptAuthWithProviderDto) {
    try {
      const gtk = await this.getGoogleToken(payload);
      const guser = await this.getGoogleUser(gtk.id_token, gtk.access_token);

      let auth = await this.authRepository.findOne({
        where: {
          username: guser.email,
          provider: AuthProvider.GOOGLE,
        },
        relations: {
          users: true,
        },
      });
      if (!auth?.id) {
        auth = await this.authRepository.save({
          username: guser.email,
          provider: AuthProvider.GOOGLE,
        });
        console.log(auth);

        const user = await this.userService.create(
          {
            authId: auth.id,
            name: guser.name,
          },
          auth,
        );
        auth.users = [user];
      }

      return {
        accessToken: this.jwtService.sign({ id: first(auth.users).id }),
        data: pick(first(auth.users), ['id', 'name']),
      };
    } catch (err) {
      console.log(err);

      return new HttpException(
        err.response.data.message || err.response.data.error,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
