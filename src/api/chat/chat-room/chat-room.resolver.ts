import { Authenticated } from '@/authorization/decorators/authenticated.decorator';
import {
  AuthenticatedUser,
  IAuthUser,
} from '@/authorization/decorators/user.decorator';
import { CommonMutationResponse } from '@/common/reference-models/common-mutation.entity';
import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import * as slug from 'slug';
import { ChatRoomService } from './chat-room.service';
import {
  AddOrRemoveGroupMembersInput,
  AddOrRemoveGroupModeratorInput,
  CreateChatGroupInput,
} from './dto/chat-room.input';
import { ChatRoom } from './entities/chat-room.entity';

@Resolver(() => ChatRoom)
export class ChatRoomResolver {
  constructor(private readonly chatRoomService: ChatRoomService) {}

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
          handle: slug(handle, '_'),
        });

      return _handleRoomCount > 0
        ? slug(handle, '_') + '_' + _handleRoomCount
        : slug(handle, '_');
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
    @Args('input') input: AddOrRemoveGroupMembersInput,
    @AuthenticatedUser() user: IAuthUser,
  ) {
    try {
      return this.chatRoomService.addMembersToGroup(input, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => Boolean, { name: 'chat__renoveGroupMembers' })
  @Authenticated()
  removeMembers(
    @Args('input') input: AddOrRemoveGroupMembersInput,
    @AuthenticatedUser() user: IAuthUser,
  ) {
    try {
      return this.chatRoomService.removeMembersFromGroup(input, user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // @Mutation(() => ChatRoom)
  // updateChatRoom(@Args('updateChatRoomInput') updateChatRoomInput: UpdateChatRoomInput) {
  //   return this.chatRoomService.update(updateChatRoomInput.id, updateChatRoomInput);
  // }

  // @Mutation(() => ChatRoom)
  // removeChatRoom(@Args('id', { type: () => Int }) id: number) {
  //   return this.chatRoomService.remove(id);
  // }
}
