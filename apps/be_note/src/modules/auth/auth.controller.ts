import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AttemptAuthDto } from './dto/attempt-auth.dto';
import { AttemptAuthWithProviderDto } from './dto/attempt-auth-with-provider.dto';
import { SignUpDto } from './dto/signup-auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  attempt(@Body() data: AttemptAuthDto) {
    return this.authService.attempt(data);
  }

  @Post('/signup')
  signUp(@Body() payload: SignUpDto) {
    return this.authService.signUp(payload);
  }

  @Post('auth0')
  auth0(@Body() payload: AttemptAuthWithProviderDto) {
    return this.authService.auth0(payload);
  }
}
