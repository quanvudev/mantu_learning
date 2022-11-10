import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import jwt from './constants/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'containers-us-west-102.railway.app',
      port: 5499,
      username: 'postgres',
      password: 'UMXEfzfO3VllQBC0KanO',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
