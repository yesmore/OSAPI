import { Test, TestingModule } from '@nestjs/testing';
import { DataCateService } from './data-cate.service';

describe('DataCateService', () => {
  let service: DataCateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataCateService],
    }).compile();

    service = module.get<DataCateService>(DataCateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
