import { Test, TestingModule } from '@nestjs/testing';
import { UvController } from './uv.controller';

describe('UvController', () => {
  let controller: UvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UvController],
    }).compile();

    controller = module.get<UvController>(UvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
