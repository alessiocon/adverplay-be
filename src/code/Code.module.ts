import { Module, forwardRef } from '@nestjs/common';
import { CodeService } from './Code.service';
import { CodeController } from './Code.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Code, CodeSchema } from './models/Code.schema';
import { GeventModule } from './../gevent/Gevent.module';
import { EmailModule } from './../email/email.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Code.name, schema: CodeSchema }]),
    forwardRef(() =>GeventModule),
    EmailModule
  ],
  controllers: [CodeController],
  providers: [CodeService],
  exports: [CodeService]
})
export class CodeModule {}
