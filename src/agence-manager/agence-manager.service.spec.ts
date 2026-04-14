import { Test, TestingModule } from '@nestjs/testing';
import { AgenceManagerService } from './agence-manager.service';

describe('AgenceManagerService', () => {
  let service: AgenceManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgenceManagerService],
    }).compile();

    service = module.get<AgenceManagerService>(AgenceManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});