import { ChatMessage, ChatRoomType, User } from '../api-models/graphql';

export interface RoomListUpdatedSocketEvent {
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
