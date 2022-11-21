import { Injectable } from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class JwtMaybeAuthGuard extends JwtAuthGuard {
  handleRequest<TUser = any>(err: any, user: any): TUser {
    return user;
  }
}
