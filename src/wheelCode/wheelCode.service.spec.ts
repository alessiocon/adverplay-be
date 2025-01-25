import { Test, TestingModule } from '@nestjs/testing';
import { WheelCodeService } from './WheelCode.service';

describe('CodeService', () => {
  let service: WheelCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WheelCodeService],
    }).compile();

    service = module.get<WheelCodeService>(WheelCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
