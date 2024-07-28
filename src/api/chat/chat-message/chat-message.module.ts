import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessageResolver } from './chat-message.resolver';
import { ChatMessageService } from './chat-message.service';
import { ChatMessage, ChatMessageSchema } from './entities/chat-message.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  providers: [ChatMessageResolver, ChatMessageService],
})
export class ChatMessageModule {}
