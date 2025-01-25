import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeventModule } from './gevent/Gevent.module';
import { WheelEventModule } from './wheelEvent/WheelEvent.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { CodeModule } from './code/Code.module';
import { WheelCodeModule } from './wheelCode/WheelCode.module';
import { MatchModule } from './match/Match.module';

require('dotenv').config();

let modImports = [
  ConfigModule.forRoot({ isGlobal:true}),
  MongooseModule.forRootAsync({useFactory: () => (
      {uri: process.env.MONGO_URL,}
    ),
  }),
  GeventModule,
  WheelEventModule,
  AuthModule,
  UserModule,
  EmailModule,
  CodeModule,
  WheelCodeModule,
  MatchModule,
];

@Module({
  imports: modImports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
