import { Test, TestingModule } from '@nestjs/testing';
import { HotelManagerController } from './hotel-manager.controller';

describe('HotelManagerController', () => {
  let controller: HotelManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelManagerController],
    }).compile();

    controller = module.get<HotelManagerController>(HotelManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
