import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ReferenceRequestModule } from './reference-request/reference-request.module';

@Module({
  imports: [UserModule, ReferenceRequestModule]
})
export class IdentityModule {}
