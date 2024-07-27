import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceRequestResolver } from './reference-request.resolver';
import { ReferenceRequestService } from './reference-request.service';

describe('ReferenceRequestResolver', () => {
  let resolver: ReferenceRequestResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferenceRequestResolver, ReferenceRequestService],
    }).compile();

    resolver = module.get<ReferenceRequestResolver>(ReferenceRequestResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
