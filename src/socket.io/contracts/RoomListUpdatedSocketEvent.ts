import { ChatMessage } from '@/api/chat/chat-message/entities/chat-message.entity';
import { ChatRoomType } from '@/api/chat/chat-room/entities/chat-room.entity';
import { User } from '@/api/identity/user/entities/user.entity';

interface IRoomListUpdatedSocketEvent {
  _id: string;
  actionType: 'room-added' | 'room-removed' | 'room-updated';
  room: {
    _id: string;
    roomType: ChatRoomType;
    handle: string;
    members: User[];
    lastMessage: ChatMessage;
    lastMessageSender: User;
  };
}

export class RoomListUpdatedSocketEvent {
  constructor(public payload: IRoomListUpdatedSocketEvent) {}
}

// export enum SOCKET_EVENT_NAME {
//   handle__emit__chat__joinRoom = 'emit:chat:join-room',
//   handle__emit__chat__leaveRoom = 'emit:chat:leave-room',
//   handle__emit__chat__messages__sendMessage = 'emit:chat:messages:send-message',
// }
