import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule} from '@nestjs/passport';
import { UserModule } from './../user/user.module';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { RFSession, RFSessionSchema } from './models/RFSession.schema';

require('dotenv').config();

@Module({
  imports:[
    UserModule,
    PassportModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '1d'}
    }),
    MongooseModule.forFeature([{ name: RFSession.name, schema: RFSessionSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
