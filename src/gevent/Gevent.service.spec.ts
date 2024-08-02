import { Test, TestingModule } from '@nestjs/testing';
import { GeventService } from './Gevent.service';

describe('EventService', () => {
  let service: GeventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeventService],
    }).compile();

    service = module.get<GeventService>(GeventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
