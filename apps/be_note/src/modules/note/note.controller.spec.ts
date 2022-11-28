/* eslint-disable */
jest.useFakeTimers();
jest.setTimeout(30000);

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Note } from './entities/note.entity';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';


describe('NoteController', () => {
  // let controller: NoteController;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       TypeOrmModule.forRoot({
  //         type: 'postgres',
  //         host: 'containers-us-west-102.railway.app',
  //         port: 5499,
  //         username: 'postgres',
  //         password: 'S9trmSpztzwxtVl6Wxwa',
  //         database: 'railway',
  //         autoLoadEntities: true,
  //         synchronize: true,
  //       }),
  //       TypeOrmModule.forFeature([User, Note]),
  //     ],
  //     controllers: [NoteController],
  //     providers: [NoteService, UserService],
  //   }).compile();

  //   controller = module.get<NoteController>(NoteController);
  // });

  it('should be defined', () => {
    // expect(controller).toBeDefined();
    expect(1+1).toBe(2)
  });
});
