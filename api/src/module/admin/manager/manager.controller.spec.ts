import { Test, TestingModule } from '@nestjs/testing';
import { ManagerController } from './manager.controller';

describe('ManagerController', () => {
  let controller: ManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagerController],
    }).compile();

    controller = module.get<ManagerController>(ManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
