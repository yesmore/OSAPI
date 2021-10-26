import { Test, TestingModule } from '@nestjs/testing';
import { IndexController } from './index.controller';

describe('IndexController', () => {
  let controller: IndexController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndexController],
    }).compile();

    controller = module.get<IndexController>(IndexController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
