import {
  AuthenticatedUser,
  IAuthUser,
} from '@/authorization/decorators/user.decorator';
import { CommonMutationResponse } from '@/common/reference-models/common-mutation.entity';
import { BadRequestException } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatMessageService } from './chat-message.service';
import { SendMessageToRoomInput } from './dto/chat-message.input';
import {
  ChatMessage,
  ChatMessagesWithPagination,
} from './entities/chat-message.entity';
import { Authenticated } from '@/authorization/decorators/authenticated.decorator';
import { CommonPaginationOnlyDto } from '@/common/dto/CommonPaginationDto';
import getGqlFields from '@/common/utils/gql-fields';

@Resolver(() => ChatMessage)
export class ChatMessageResolver {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Mutation(() => CommonMutationResponse, {
    name: 'chat__sendMessageToRoom',
    description: 'Send message to chat room \n 🔐 Autneticated',
  })
  @Authenticated()
  sendMessageToRoom(
    @Args('input') input: SendMessageToRoomInput,
    @AuthenticatedUser() authUser: IAuthUser,
  ) {
    try {
      return this.chatMessageService.sendMessageToRoom({
        roomId: input.roomId,
        text: input.text,
        userId: authUser.sub,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Query(() => ChatMessagesWithPagination, {
    name: 'chat__roomMessages',
    description: '🔐 Autneticated',
  })
  @Authenticated()
  roomMessages(
    @Args('roomId') roomId: string,
    @Args('where', { nullable: true }) where: CommonPaginationOnlyDto,
    @Info() info: any,
    @AuthenticatedUser() authUser: IAuthUser,
  ) {
    try {
      return this.chatMessageService.getRoomMessages(
        roomId,
        where,
        getGqlFields(info, 'nodes'),
        authUser,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
