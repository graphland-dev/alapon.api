import { ChatMessageType } from '@/api/chat/chat-message/entities/chat-message.entity';

export interface ISendOrUpdateMessageSocketDto {
  roomId: string;
  roomHandle: string;
  userId: string;
  messageText: string;
  userHandle: string;
  messageId?: string;
  messageType: ChatMessageType;
}

export interface ISocketCallDto {
  roomId?: string;
  roomHandle?: string;
  userId?: string;
  userHandle?: string;
  isOngoingCall?: boolean;
}
