import { ChatMessageType } from '@/common/api-models/graphql';

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
