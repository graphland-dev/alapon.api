import { IAuthUser } from '@/authorization/decorators/user.decorator';
import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';
import { CommonPaginationOnlyDto } from '@/common/dto/CommonPaginationDto';
import { ISendOrUpdateMessageSocketDto } from '@/socket.io/dtos/socket.dto';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { CreateChatMessageInput } from './dto/chat-message.input';
import { ChatMessage, ChatMessageType } from './entities/chat-message.entity';

@Injectable()
export class ChatMessageService extends BaseDatabaseRepository<ChatMessage> {
  private logger: Logger = new Logger('ChatMessageService');
  constructor(
    @InjectModel(ChatMessage.name)
    public readonly chatMessageModel: Model<ChatMessage>,
    @Inject(forwardRef(() => ChatRoomService))
    public readonly chatRoomService: ChatRoomService,
  ) {
    super(chatMessageModel);
  }

  async sendMessageToRoom(input: CreateChatMessageInput) {
    const _room = await this.chatRoomService.chatRoomModel.findOne({
      _id: input.roomId,
    });

    if (!_room) {
      throw new NotFoundException('Invalid room id');
    }

    const message = await this.chatMessageModel.create({
      text: input.text,
      createdBy: input?.userId,
      chatRoom: input?.roomId,
      messageType: input?.messageType || ChatMessageType.USER_MESSAGE,
    });

    // Update last message
    await this.chatRoomService.chatRoomModel.updateOne(
      { _id: input.roomId },
      {
        $set: {
          lastMessage: message._id,
          lastMessageSender: input?.userId,
        },
      },
    );

    // Send message to socket channel
    // await this.socketIoGateway.broadCastMessage(
    //   `room-messages:${input.roomId}`,
    //   message,
    // );

    return message;
  }

  async getRoomMessages(
    roomId: string,
    where: CommonPaginationOnlyDto,
    fields: any,
    user: IAuthUser,
  ) {
    const _room = await this.chatRoomService.chatRoomModel.findOne({
      _id: roomId,
    });

    if (!_room) {
      throw new NotFoundException('Invalid room id');
    }

    // check if user is a member of the room
    if (
      !Boolean(
        _room.members.map((member) => member.toString()).includes(user.sub),
      )
    ) {
      throw new ForbiddenException('You are not a member of this room');
    }

    return this.findAllWithPagination(
      where,
      fields,
      [{ path: 'chatRoom' }, { path: 'createdBy' }],
      {
        chatRoom: roomId,
      },
    );
  }

  @OnEvent('chatroom:messages:sync')
  async handleSaveMessageEvent(payload: ISendOrUpdateMessageSocketDto) {
    this.logger.log('chatroom:messages:sync', JSON.stringify(payload, null, 2));
    if (payload.messageId) {
      const _msg = await this.chatMessageModel.findOne({
        _id: payload.messageId,
      });
      if (!_msg) throw new NotFoundException('Invalid message id');

      await this.chatMessageModel.updateOne(
        { _id: payload.messageId },
        {
          $set: {
            text: payload.messageText,
            createdBy: payload?.userId,
            chatRoom: payload?.roomId,
            messageType: payload?.messageType || ChatMessageType.USER_MESSAGE,
          },
        },
      );
    } else {
      await this.chatMessageModel.create(payload);
    }

    // const createdMessage = await this.chatMessageModel.create(payload);

    // const _room = await this.chatRoomService.chatRoomModel
    //   .findOne({
    //     _id: payload.chatRoom,
    //   })
    //   .populate('members');

    // Update last message
    // const updatedRoom = await this.chatRoomService.chatRoomModel.updateOne(
    //   { _id: payload.chatRoom },
    //   {
    //     $set: {
    //       lastMessage: payload._id,
    //       lastMessageSender: payload.createdBy._id,
    //     },
    //   },
    // );
  }
}
