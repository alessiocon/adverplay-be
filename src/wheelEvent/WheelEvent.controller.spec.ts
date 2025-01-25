import { Test, TestingModule } from '@nestjs/testing';
import { WheelEventController } from './WheelEvent.controller';
import { WheelEventService } from './WheelEvent.service';

describe('EventController', () => {
  let controller: WheelEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WheelEventController],
      providers: [WheelEventService],
    }).compile();

    controller = module.get<WheelEventController>(WheelEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
