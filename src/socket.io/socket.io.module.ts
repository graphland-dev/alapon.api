import { forwardRef, Module } from '@nestjs/common';
import { SocketIoGateway } from './socket.io.gateway';
import { SocketChatService } from './socket-chat.service';
import { ChatRoomModule } from '@/api/chat/chat-room/chat-room.module';

@Module({
  imports: [forwardRef(() => ChatRoomModule)],
  providers: [SocketIoGateway, SocketChatService],
  exports: [SocketIoGateway],
})
export class SocketIoModule {}
