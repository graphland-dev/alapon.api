import { UserModule } from '@/api/identity/user/user.module';
import { SocketIoModule } from '@/socket.io/socket.io.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessageModule } from '../chat-message/chat-message.module';
import { ChatRoomResolver } from './chat-room.resolver';
import { ChatRoomService } from './chat-room.service';
import { ChatRoom, ChatRoomSchema } from './entities/chat-room.entity';

@Module({
  imports: [
    UserModule,
    forwardRef(() => ChatMessageModule),
    forwardRef(() => SocketIoModule),
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
  ],
  providers: [ChatRoomResolver, ChatRoomService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
