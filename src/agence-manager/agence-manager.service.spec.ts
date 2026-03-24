import { Test, TestingModule } from '@nestjs/testing';
import { AgencyManagerService } from './agence-manager.service';

describe('AgencyManagerService', () => {
  let service: AgencyManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencyManagerService],
    }).compile();

    service = module.get<AgencyManagerService>(AgencyManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
