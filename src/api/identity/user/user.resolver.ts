import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JoinUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';
import { JoinUserResponse } from './dto/join-user-response.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => JoinUserResponse)
  join(@Args('input') input: JoinUserInput) {
    try {
      return this.userService.joinUser(input);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
