import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ReferenceRequestModule } from './reference-request/reference-request.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, ReferenceRequestModule, AuthModule],
})
export class IdentityModule {}
