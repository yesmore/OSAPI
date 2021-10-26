import { Test, TestingModule } from '@nestjs/testing';
import { DataAttrService } from './data-attr.service';

describe('DataAttrService', () => {
  let service: DataAttrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataAttrService],
    }).compile();

    service = module.get<DataAttrService>(DataAttrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
