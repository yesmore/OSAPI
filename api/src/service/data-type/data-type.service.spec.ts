import { Test, TestingModule } from '@nestjs/testing';
import { DataTypeService } from './data-type.service';

describe('DataTypeService', () => {
  let service: DataTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataTypeService],
    }).compile();

    service = module.get<DataTypeService>(DataTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
