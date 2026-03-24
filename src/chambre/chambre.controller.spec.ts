import { Test, TestingModule } from '@nestjs/testing';
import { ChambreController } from './chambre.controller';

describe('ChambreController', () => {
  let controller: ChambreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChambreController],
    }).compile();

    controller = module.get<ChambreController>(ChambreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
