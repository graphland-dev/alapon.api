import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserByAdmin } from '../user/dto/create-user.input';
import { AuthService } from './auth.service';
import { BasicAuth } from '@/authorization/decorators/basic-auth.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-user-by-admin')
  @BasicAuth()
  join(@Body() body: CreateUserByAdmin) {
    return this.authService.joinUser(body as any, true);
  }
}
