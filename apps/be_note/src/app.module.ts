import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import jwt from './constants/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { NoteModule } from './modules/note/note.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'containers-us-west-102.railway.app',
      port: 5499,
      username: 'postgres',
      password: 'S9trmSpztzwxtVl6Wxwa',
      database: 'railway',
      autoLoadEntities: true,
      synchronize: true,
    }),
    JwtModule.register({
      secret: jwt.secretOrKey,
      signOptions: jwt.signOptions,
    }),
    AuthModule,
    UserModule,
    NoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}