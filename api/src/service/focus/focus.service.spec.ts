import { Test, TestingModule } from '@nestjs/testing';
import { FocusService } from './focus.service';

describe('FocusService', () => {
  let service: FocusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FocusService],
    }).compile();

    service = module.get<FocusService>(FocusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
