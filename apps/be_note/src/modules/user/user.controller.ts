import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Request() req: { user: { id: number } }) {
    const data = await this.userService.findOne(+req.user.id);
    return new HttpException(data, HttpStatus.OK);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/note')
  async note(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Request() req: { user: { id: number } },
  ) {
    const data = await this.userService.findMyNote(+req.user.id, {
      page,
      limit,
      route: '?',
    });
    return new HttpException(data, HttpStatus.OK);
  }
}
