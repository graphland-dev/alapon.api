import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReferenceRequest } from './entities/reference-request.entity';
import { Model } from 'mongoose';
import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';

@Injectable()
export class ReferenceRequestService extends BaseDatabaseRepository<ReferenceRequest> {
  constructor(
    @InjectModel(ReferenceRequest.name)
    public readonly referenceRequestModel: Model<ReferenceRequest>,
  ) {
    super(referenceRequestModel);
  }
}
