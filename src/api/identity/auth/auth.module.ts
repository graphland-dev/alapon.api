import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { ReferenceRequestModule } from '../reference-request/reference-request.module';

@Module({
  providers: [AuthResolver, AuthService],
  imports: [UserModule, UserModule, ReferenceRequestModule],
})
export class AuthModule {}
