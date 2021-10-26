import { Test, TestingModule } from '@nestjs/testing';
import { DataTypeController } from './data-type.controller';

describe('DataTypeController', () => {
  let controller: DataTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataTypeController],
    }).compile();

    controller = module.get<DataTypeController>(DataTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
