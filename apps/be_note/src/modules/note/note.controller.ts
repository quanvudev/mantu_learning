import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtMaybeAuthGuard } from '../auth/jwt-maybe-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteService } from './note.service';

@Controller('note')
@ApiTags('Note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @UseGuards(JwtMaybeAuthGuard)
  create(
    @Body() createNoteDto: CreateNoteDto,
    @Request() req: { user?: { id: number } },
  ) {
    return this.noteService.create(createNoteDto, req.user?.id);
  }

  @Get()
  @ApiQuery({
    name: 'page',
  })
  @ApiQuery({
    name: 'limit',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.noteService.findAll({ page, limit, route: '?' });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noteService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.noteService.update(+id, +req.user.id, updateNoteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(
    @Param('id') id: string,
    @Request() req: { user: { id: number } },
    @Query('hard', new DefaultValuePipe(false), ParseBoolPipe) hard = false,
  ) {
    return this.noteService.remove(+id, req.user.id, hard);
  }

  @Patch(':id/recover')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  recover(@Param('id') id: string, @Request() req: { user: { id: number } }) {
    return this.noteService.recover(+id, +req.user.id);
  }
}
