import { Test, TestingModule } from '@nestjs/testing';
import { WheelCodeController } from './WheelCode.controller';
import { WheelCodeService } from './WheelCode.service';

describe('WheelCodeController', () => {
  let controller: WheelCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WheelCodeController],
      providers: [WheelCodeService],
    }).compile();

    controller = module.get<WheelCodeController>(WheelCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
