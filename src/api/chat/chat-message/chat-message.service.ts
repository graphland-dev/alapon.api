import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatMessageInput } from './dto/chat-message.input';
import { ChatMessage, ChatMessageType } from './entities/chat-message.entity';

@Injectable()
export class ChatMessageService extends BaseDatabaseRepository<ChatMessage> {
  constructor(
    @InjectModel(ChatMessage.name)
    public readonly chatMessageModel: Model<ChatMessage>,
  ) {
    super(chatMessageModel);
  }

  async sendMessageToRoom(input: CreateChatMessageInput) {
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
