import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { IsNull, Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private notesRepo: Repository<Note>,
    private readonly userService: UserService,
  ) {
    //
  }
  async create(createNoteDto: CreateNoteDto, userId?: number) {
    let user = null;
    if (userId) user = await this.userService.findById(userId);

    return this.notesRepo.save({
      content: createNoteDto.content,
      user,
    });
  }

  async findAll(options: IPaginationOptions) {
    return paginate(this.notesRepo, options, {
      where: { deletedAt: IsNull() },
      order: {
        createdAt: {
          direction: 'DESC',
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, userId: number, updateNoteDto: UpdateNoteDto) {
    return this.notesRepo.save({ id, content: updateNoteDto.content, userId });
  }

  async remove(id: number, userId: number, hard = false) {
    const note = await this.notesRepo.find({
      where: { id, user: { id: userId } },
    });
    if (!note)
      return new HttpException('Permission denined', HttpStatus.FORBIDDEN);

    if (hard) return this.notesRepo.delete(id);

    return this.notesRepo.save({
      id,
      deletedAt: new Date().toISOString(),
    });
  }
  async recover(id: number, userId: number) {
    const note = await this.notesRepo.find({
      where: { id, user: { id: userId } },
    });
    if (!note)
      return new HttpException('Permission denined', HttpStatus.FORBIDDEN);

    return this.notesRepo.save({
      id,
      deletedAt: null,
    });
  }
}
