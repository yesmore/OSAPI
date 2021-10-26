import { Test, TestingModule } from '@nestjs/testing';
import { RoleaccessService } from './roleaccess.service';

describe('RoleAccessService', () => {
  let service: RoleaccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleaccessService],
    }).compile();

    service = module.get<RoleaccessService>(RoleaccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
