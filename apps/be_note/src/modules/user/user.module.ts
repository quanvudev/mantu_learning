import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth } from '../auth/entities/auth.entity';
import { Note } from '../note/entities/note.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Auth, Note])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
