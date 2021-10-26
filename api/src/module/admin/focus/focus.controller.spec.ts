import { Test, TestingModule } from '@nestjs/testing';
import { FocusController } from './focus.controller';

describe('FocusController', () => {
  let controller: FocusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FocusController],
    }).compile();

    controller = module.get<FocusController>(FocusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
