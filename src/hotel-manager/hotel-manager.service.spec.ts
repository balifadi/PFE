import { Test, TestingModule } from '@nestjs/testing';
import { HotelManagerService } from './hotel-manager.service';

describe('HotelManagerService', () => {
  let service: HotelManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotelManagerService],
    }).compile();

    service = module.get<HotelManagerService>(HotelManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
