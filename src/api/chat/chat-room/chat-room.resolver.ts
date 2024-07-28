import { Authenticated } from '@/authorization/decorators/authenticated.decorator';
import { CommonMutationResponse } from '@/common/reference-models/common-mutation.entity';
import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ChatRoomService } from './chat-room.service';
import { CreateChatGroupInput } from './dto/chat-room.input';
import { ChatRoom, ChatRoomType } from './entities/chat-room.entity';

@Resolver(() => ChatRoom)
export class ChatRoomResolver {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Mutation(() => CommonMutationResponse, { name: 'chat__createChatRoom' })
  @Authenticated()
  createChatRoom(@Args('input') input: CreateChatGroupInput) {
    try {
      return this.chatRoomService.createOne({
        ...input,
        // owner: this.user.id,
        roomType: ChatRoomType.GROUP,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // @Query(() => [ChatRoom], { name: 'chatRoom' })
  // findAll() {
  //   return this.chatRoomService.findAll();
  // }

  // @Query(() => ChatRoom, { name: 'chatRoom' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.chatRoomService.findOne(id);
  // }

  // @Mutation(() => ChatRoom)
  // updateChatRoom(@Args('updateChatRoomInput') updateChatRoomInput: UpdateChatRoomInput) {
  //   return this.chatRoomService.update(updateChatRoomInput.id, updateChatRoomInput);
  // }

  // @Mutation(() => ChatRoom)
  // removeChatRoom(@Args('id', { type: () => Int }) id: number) {
  //   return this.chatRoomService.remove(id);
  // }
}
