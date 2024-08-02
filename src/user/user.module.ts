import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/User.schema';
import { EmailModule } from './../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EmailModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
