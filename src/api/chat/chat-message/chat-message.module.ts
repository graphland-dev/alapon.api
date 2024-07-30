import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessageResolver } from './chat-message.resolver';
import { ChatMessageService } from './chat-message.service';
import { ChatMessage, ChatMessageSchema } from './entities/chat-message.entity';
import { ChatRoomModule } from '../chat-room/chat-room.module';
import { SocketIoModule } from '@/socket.io/socket.io.module';

@Module({
  imports: [
    forwardRef(() => ChatRoomModule),
    forwardRef(() => SocketIoModule),
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  providers: [ChatMessageResolver, ChatMessageService],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
