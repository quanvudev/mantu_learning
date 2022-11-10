import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AttemptAuthDto } from './dto/attempt-auth.dto';
import { SignUpDto } from './dto/signup-auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('')
  attempt(@Body() data: AttemptAuthDto) {
    return this.authService.attempt(data);
  }

  @Post('/signup')
  signUp(@Body() payload: SignUpDto) {
    return this.authService.signUp(payload);
  }
}
