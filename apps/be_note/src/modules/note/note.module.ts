import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Note } from './entities/note.entity';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Note])],
  controllers: [NoteController],
  providers: [NoteService, UserService],
})
export class NoteModule {}
