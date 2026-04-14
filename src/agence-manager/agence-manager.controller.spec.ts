import { Test, TestingModule } from '@nestjs/testing';
import { AgenceManagerController } from './agence-manager.controller';

describe('AgenceManagerController', () => {
  let controller: AgenceManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgenceManagerController],
    }).compile();

    controller = module.get<AgenceManagerController>(AgenceManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
