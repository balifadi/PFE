import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let controller: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationService],
    }).compile();

    controller = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
