import { Args, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Query } from '@nestjs/graphql';
import * as slug from 'slug';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String, { name: 'identity__getUniqueHandle' })
  async getUserHandle(@Args('handle') handle: string) {
    const _count = await this.userService.userModel.countDocuments({
      handle: slug(handle, '_'),
    });

    return _count ? slug(handle, '_') + '_' + _count : slug(handle, '_');
  }
}
