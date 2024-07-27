import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReferenceRequest,
  ReferenceRequestSchema,
} from './entities/reference-request.entity';
import { ReferenceRequestResolver } from './reference-request.resolver';
import { ReferenceRequestService } from './reference-request.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReferenceRequest.name, schema: ReferenceRequestSchema },
    ]),
  ],
  providers: [ReferenceRequestResolver, ReferenceRequestService],
  exports: [ReferenceRequestService],
})
export class ReferenceRequestModule {}
