import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WheelCodeService } from './WheelCode.service';
import { WheelCodeController } from './WheelCode.controller';
import { WheelCode, WheelCodeSchema } from './models/WheelCode.schema';
import { WheelEventModule } from './../wheelEvent/WheelEvent.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: WheelCode.name, schema: WheelCodeSchema }]),
    forwardRef(() => WheelEventModule),
  ],
  controllers: [WheelCodeController],
  providers: [WheelCodeService],
  exports: [WheelCodeService]
})
export class WheelCodeModule {}
