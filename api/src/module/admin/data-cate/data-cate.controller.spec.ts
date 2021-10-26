import { Test, TestingModule } from '@nestjs/testing';
import { DataCateController } from './data-cate.controller';

describe('DataCateController', () => {
  let controller: DataCateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataCateController],
    }).compile();

    controller = module.get<DataCateController>(DataCateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
