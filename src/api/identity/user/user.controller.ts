import { BasicAuth } from '@/authorization/decorators/basic-auth.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserListDto } from './dto/users.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @BasicAuth()
  getAllUsers(@Query() query: UserListDto) {
    return this.userService.findAllWithPagination(query);
  }
}
