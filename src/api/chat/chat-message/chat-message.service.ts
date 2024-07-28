import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatMessageInput } from './dto/chat-message.input';
import { ChatMessage, ChatMessageType } from './entities/chat-message.entity';
import { ChatRoomService } from '../chat-room/chat-room.service';

@Injectable()
export class ChatMessageService extends BaseDatabaseRepository<ChatMessage> {
  constructor(
    @InjectModel(ChatMessage.name)
    public readonly chatMessageModel: Model<ChatMessage>,
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
}
