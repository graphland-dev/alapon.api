import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceRequestService } from './reference-request.service';

describe('ReferenceRequestService', () => {
  let service: ReferenceRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferenceRequestService],
    }).compile();

    service = module.get<ReferenceRequestService>(ReferenceRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
