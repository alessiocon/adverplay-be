import { Test, TestingModule } from '@nestjs/testing';
import { WheelEventService } from './WheelEvent.service';

describe('EventService', () => {
  let service: WheelEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WheelEventService],
    }).compile();

    service = module.get<WheelEventService>(WheelEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
