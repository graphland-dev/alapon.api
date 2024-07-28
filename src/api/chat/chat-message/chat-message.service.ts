import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatMessageInput } from './dto/chat-message.input';
import { ChatMessage, ChatMessageType } from './entities/chat-message.entity';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { IAuthUser } from '@/authorization/decorators/user.decorator';
import { CommonPaginationOnlyDto } from '@/common/dto/CommonPaginationDto';

@Injectable()
export class ChatMessageService extends BaseDatabaseRepository<ChatMessage> {
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

    // TODO: Send socket message to room
    // TODO: Send push notification to room members
    // socket channel: 'chatRoom:{roomId}'

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
}
