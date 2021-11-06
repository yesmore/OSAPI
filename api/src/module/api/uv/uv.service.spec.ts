import { Test, TestingModule } from '@nestjs/testing';
import { UvService } from './uv.service';

describe('UvService', () => {
  let service: UvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UvService],
    }).compile();

    service = module.get<UvService>(UvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
