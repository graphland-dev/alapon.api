import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomResolver } from './chat-room.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from './entities/chat-room.entity';
import { UserModule } from '@/api/identity/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
  ],
  providers: [ChatRoomResolver, ChatRoomService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
