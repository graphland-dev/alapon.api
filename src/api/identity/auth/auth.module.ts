import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { ReferenceRequestModule } from '../reference-request/reference-request.module';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthResolver, AuthService],
  imports: [UserModule, UserModule, ReferenceRequestModule],
  controllers: [AuthController],
})
export class AuthModule {}
