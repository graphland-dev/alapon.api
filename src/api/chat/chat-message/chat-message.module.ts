import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessageResolver } from './chat-message.resolver';
import { ChatMessageService } from './chat-message.service';
import { ChatMessage, ChatMessageSchema } from './entities/chat-message.entity';
import { ChatRoomModule } from '../chat-room/chat-room.module';

@Module({
  imports: [
    forwardRef(() => ChatRoomModule),
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  providers: [ChatMessageResolver, ChatMessageService],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
