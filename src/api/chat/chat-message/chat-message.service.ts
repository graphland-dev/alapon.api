import { IAuthUser } from '@/authorization/decorators/user.decorator';
import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';
import { CommonPaginationOnlyDto } from '@/common/dto/CommonPaginationDto';
import { SocketIoGateway } from '@/socket.io/socket.io.gateway';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { CreateChatMessageInput } from './dto/chat-message.input';
import { ChatMessage, ChatMessageType } from './entities/chat-message.entity';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ChatMessageService extends BaseDatabaseRepository<ChatMessage> {
  private logger: Logger = new Logger('ChatMessageService');
  constructor(
    @InjectModel(ChatMessage.name)
    public readonly chatMessageModel: Model<ChatMessage>,
    @Inject(forwardRef(() => ChatRoomService))
    public readonly chatRoomService: ChatRoomService,
    private readonly socketIoGateway: SocketIoGateway,
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
    await this.socketIoGateway.broadCastMessage(
      `room-messages:${input.roomId}`,
      JSON.stringify(message),
    );

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

  @OnEvent('message-send-to-room')
  async handleOrderCreatedEvent(payload: any) {
    // this.eventEmitter.emit('message-send-to-room', {
    //   _id: msgId,
    //   messageType: 'USER_MESSAGE',
    //   text: data.messageText,
    //   createdBy: data.userId,
    //   chatRoom: data.roomId,
    //   createdAt: time,
    //   updatedAt: time,
    // });
    this.logger.debug('Storing socket message to database', payload);
    const createdMessage = await this.chatMessageModel.create(payload);

    // Update last message
    const updatedRoom = await this.chatRoomService.chatRoomModel.updateOne(
      { _id: payload.chatRoom },
      {
        $set: {
          lastMessage: payload._id,
          lastMessageSender: payload.createdBy,
        },
      },
    );

    console.log(
      JSON.stringify(
        {
          createdMessage,
          updatedRoom,
        },
        null,
        2,
      ),
    );
  }
}
