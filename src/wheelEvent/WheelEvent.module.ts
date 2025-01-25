import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WheelEventService } from './WheelEvent.service';
import { WheelEventController } from './WheelEvent.controller';
import { WheelEvent, WheelEventSchema } from './models/WheelEvent.schema';
import { CodeModule } from './../code/Code.module';
import { Code, CodeSchema } from './../code/models/Code.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: WheelEvent.name, schema: WheelEventSchema }]),
    MongooseModule.forFeature([{ name: Code.name, schema: CodeSchema }]),
    forwardRef(() => CodeModule)
  ],
  controllers: [WheelEventController],
  providers: [WheelEventService],
  exports:[WheelEventService]
})
export class WheelEventModule {}
