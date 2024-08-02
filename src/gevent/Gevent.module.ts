import { Module, forwardRef } from '@nestjs/common';
import { GeventService } from './Gevent.service';
import { GeventController } from './Gevent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gevent, GeventSchema } from './models/Gevent.schema';
import { CodeModule } from './../code/Code.module';
import { Code, CodeSchema } from './../code/models/Code.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Gevent.name, schema: GeventSchema }]),
    MongooseModule.forFeature([{ name: Code.name, schema: CodeSchema }]),
    forwardRef(() => CodeModule)
  ],
  controllers: [GeventController],
  providers: [GeventService],
  exports:[GeventService]
})
export class GeventModule {}
