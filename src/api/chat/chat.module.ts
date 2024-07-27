import { Module } from '@nestjs/common';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { ChatMessageModule } from './chat-message/chat-message.module';

@Module({
  imports: [ChatRoomModule, ChatMessageModule]
})
export class ChatModule {}
