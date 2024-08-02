import { Test, TestingModule } from '@nestjs/testing';
import { GeventController } from './Gevent.controller';
import { GeventService } from './Gevent.service';

describe('EventController', () => {
  let controller: GeventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeventController],
      providers: [GeventService],
    }).compile();

    controller = module.get<GeventController>(GeventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
