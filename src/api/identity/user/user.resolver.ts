import { CommonPaginationDto } from '@/common/dto/CommonPaginationDto';
import getGqlFields from '@/common/utils/gql-fields';
import { BadRequestException } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import * as slug from 'slug';
import { User, UsersWithPagination } from './entities/user.entity';
import { UserService } from './user.service';

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

  @Query(() => UsersWithPagination, {
    name: 'identity__users',
  })
  requests(
    @Args('where', { nullable: true }) where: CommonPaginationDto,
    @Info() info: any,
  ) {
    try {
      return this.userService.findAllWithPagination(
        where,
        getGqlFields(info, 'nodes'),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
