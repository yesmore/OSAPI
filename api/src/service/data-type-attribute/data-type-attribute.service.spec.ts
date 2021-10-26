import { Test, TestingModule } from '@nestjs/testing';
import { DataTypeAttributeService } from './data-type-attribute.service';

describe('DataTypeAttributeService', () => {
  let service: DataTypeAttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataTypeAttributeService],
    }).compile();

    service = module.get<DataTypeAttributeService>(DataTypeAttributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
