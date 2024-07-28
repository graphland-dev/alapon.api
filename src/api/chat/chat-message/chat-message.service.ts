import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage } from './entities/chat-message.entity';
import { Model } from 'mongoose';
import { BaseDatabaseRepository } from '@/common/database/BaseDatabaseRepository';

@Injectable()
export class ChatMessageService extends BaseDatabaseRepository<ChatMessage> {
  constructor(
    @InjectModel(ChatMessage.name)
    public readonly chatMessageModel: Model<ChatMessage>,
  ) {
    super(chatMessageModel);
  }
}
