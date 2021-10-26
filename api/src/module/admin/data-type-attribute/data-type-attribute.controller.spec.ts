import { Test, TestingModule } from '@nestjs/testing';
import { DataTypeAttributeController } from './data-type-attribute.controller';

describe('DataTypeAttributeController', () => {
  let controller: DataTypeAttributeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataTypeAttributeController],
    }).compile();

    controller = module.get<DataTypeAttributeController>(DataTypeAttributeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
