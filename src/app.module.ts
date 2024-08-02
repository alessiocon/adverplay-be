import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'
import { GeventModule } from './gevent/Gevent.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { CodeModule } from './code/Code.module';
import { MatchModule } from './match/Match.module';

require('dotenv').config();

let modImports = [
  ConfigModule.forRoot({ isGlobal:true}),
  MongooseModule.forRootAsync({useFactory: () => (
      {uri: process.env.MONGO_URL,}
    ),
  }),
  GeventModule,
  AuthModule,
  UserModule,
  EmailModule,
  CodeModule,
  MatchModule,
];

@Module({
  imports: modImports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
