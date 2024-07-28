import { Authenticated } from '@/authorization/decorators/authenticated.decorator';
import {
  AuthenticatedUser,
  IAuthUser,
} from '@/authorization/decorators/user.decorator';
import { CommonPaginationOnlyDto } from '@/common/dto/CommonPaginationDto';
import { CommonMutationResponse } from '@/common/reference-models/common-mutation.entity';
import getGqlFields from '@/common/utils/gql-fields';
import { slugify } from '@/common/utils/slug';
import { BadRequestException } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatRoomService } from './chat-room.service';
import {
  AddOrRemoveGroupModeratorInput,
  CreateChatGroupInput,
  GroupMemberMutationInput,
  JoinOrLeaveGroupInput,
} from './dto/chat-room.input';
import { ChatRoom, ChatRoomsWithPagination } from './entities/chat-room.entity';

@Resolver(() => ChatRoom)
export class ChatRoomResolver {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Query(() => ChatRoomsWithPagination, {
    name: 'chat__myChatRooms',
  })
  @Authenticated()
  myChatRooms(
    @Args('where', { nullable: true }) where: CommonPaginationOnlyDto,
    @Info() info: any,
    @AuthenticatedUser() user: IAuthUser,
  ) {
    try {
      return this.chatRoomService.myChatRooms(
        where,
        getGqlFields(info, 'nodes'),
        user,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => CommonMutationResponse, {
    name: 'chat__createChatGroup',
    description: 'Create a new chat group \n 🔐 Authenticated',
  })
  @Authenticated()
  async createChatRoom(
    @Args('input') input: CreateChatGroupInput,
    @AuthenticatedUser() user: IAuthUser,
  ) {
    try {
      return this.chatRoomService.createGroup(input, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => String, {
    name: 'chat__getUniqueRoomHandle',
    description: 'Get a unique room handle',
  })
  async getUniqueGroupHandle(
    @Args('handle', { type: () => String }) handle: string,
  ) {
    try {
      const _handleRoomCount =
        await this.chatRoomService.chatRoomModel.countDocuments({
          handle: slugify(handle),
        });

      return _handleRoomCount > 0
        ? slugify(handle) + '_' + _handleRoomCount
        : slugify(handle);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => Boolean, { name: 'chat__addGroupModerators' })
  @Authenticated()
  addGroupModerators(
    @Args('input') input: AddOrRemoveGroupModeratorInput,
    @AuthenticatedUser() user: IAuthUser,
  ) {
    try {
      return this.chatRoomService.addModeratorsToRoom(input, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => Boolean, { name: 'chat__removeGroupModerators' })
  @Authenticated()
  removeGroupModerators(
    @Args('input') input: AddOrRemoveGroupModeratorInput,
    @AuthenticatedUser() user: IAuthUser,
  ) {
    try {
      return this.chatRoomService.removeModeratorsToRoom(input, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => Boolean, { name: 'chat__addGroupMembers' })
  @Authenticated()
  addMembers(
    @Args('input') input: GroupMemberMutationInput,
    @AuthenticatedUser() user: IAuthUser,
  ) {
    try {
      return this.chatRoomService.addMembersToGroup(input, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => Boolean, { name: 'chat__joinGroup' })
  @Authenticated()
  joinGroup(
    @Args('input') input: JoinOrLeaveGroupInput,
    @AuthenticatedUser() user: IAuthUser,
  ) {
    try {
      return this.chatRoomService.joinGroup(input, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => Boolean, { name: 'chat__leaveGroup' })
  @Authenticated()
  leaveGroup(
    @Args('input') input: JoinOrLeaveGroupInput,
    @AuthenticatedUser() user: IAuthUser,
  ) {
    try {
      return this.chatRoomService.leaveGroup(input, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // @Mutation(() => Boolean, { name: 'chat__renoveGroupMembers' })
  // @Authenticated()
  // removeMembers(
  //   @Args('input') input: GroupMemberMutationInput,
  //   @AuthenticatedUser() user: IAuthUser,
  // ) {
  //   try {
  //     return this.chatRoomService.removeMembersFromGroup(input, user);
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  @Mutation(() => Boolean, { name: 'chat__kickGroupMembers' })
  @Authenticated()
  kickMembers(
    @Args('input') input: GroupMemberMutationInput,
    @AuthenticatedUser() user: IAuthUser,
  ) {
    try {
      return this.chatRoomService.kickMembersFromGroup(input, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => Boolean, { name: 'chat__unKickGroupMembers' })
  @Authenticated()
  unKickGroupMembers(
    @Args('input') input: GroupMemberMutationInput,
    @AuthenticatedUser() user: IAuthUser,
  ) {
    try {
      return this.chatRoomService.unKickGroupMembers(input, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
