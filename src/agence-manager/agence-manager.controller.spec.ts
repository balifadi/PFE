import { Test, TestingModule } from '@nestjs/testing';
import { AgencyManagerController } from './agence-manager.controller';

describe('AgencyManagerController', () => {
  let controller: AgencyManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyManagerController],
    }).compile();

    controller = module.get<AgencyManagerController>(AgencyManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
