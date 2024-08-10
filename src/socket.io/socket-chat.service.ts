import { ChatRoomService } from '@/api/chat/chat-room/chat-room.service';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocketServer } from '@nestjs/websockets';
import mongoose from 'mongoose';
import { Namespace } from 'socket.io';
import {
  ISendOrUpdateMessageSocketDto,
  ISocketCallDto,
} from './dtos/socket.dto';

@Injectable()
export class SocketChatService {
  @WebSocketServer()
  public io: Namespace;
  private logger: Logger = new Logger('SocketChatService');

  constructor(
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => ChatRoomService))
    private chatRoomService: ChatRoomService,
  ) {}

  async sendMessageToChatRoom(
    onSendToSocket: (payload: any) => void,
    payload: ISendOrUpdateMessageSocketDto,
  ) {
    const msgId = new mongoose.Types.ObjectId().toString();
    const time = new Date().toISOString();

    onSendToSocket({
      _id: msgId,
      messageType: payload.messageType,
      createdBy: {
        handle: payload.userHandle,
        _id: payload.userId,
      },
      chatRoom: {
        _id: payload.roomId,
        handle: payload.roomHandle,
      },
      text: payload.messageText,
      createdAt: time,
      updatedAt: time,
    });

    this.syncChatRoomMessagesWithDatabase({
      ...payload,
      messageId: msgId,
    });
  }

  updateMessageToChatRoom(
    onSendToSocket: (payload: any) => void,
    payload: ISendOrUpdateMessageSocketDto,
  ) {
    const time = new Date().toISOString();
    onSendToSocket({
      _id: payload.messageId,
      messageType: payload.messageType,
      createdBy: {
        handle: payload.userHandle,
        _id: payload.userId,
      },
      chatRoom: {
        _id: payload.roomId,
        handle: payload.roomHandle,
      },
      text: payload.messageText,
      createdAt: time,
      updatedAt: time,
    });
    // socket.broadcast
    //   .to(payload.roomId)
    //   .emit(`listen:chat:${payload.roomId}:messages:updated`, {
    //     _id: payload.messageId,
    //     messageType: payload.messageType,
    //     createdBy: {
    //       handle: payload.userHandle,
    //       _id: payload.userId,
    //     },
    //     chatRoom: {
    //       _id: payload.roomId,
    //       handle: payload.roomHandle,
    //     },
    //     text: payload.messageText,
    //     createdAt: time,
    //     updatedAt: time,
    //   });

    this.syncChatRoomMessagesWithDatabase(payload);
  }

  syncChatRoomMessagesWithDatabase(payload: ISendOrUpdateMessageSocketDto) {
    const msgId = payload.messageId || new mongoose.Types.ObjectId().toString();
    const time = new Date().toISOString();

    this.eventEmitter.emit('chatroom:messages:sync', {
      _id: msgId,
      messageType: payload.messageType,
      text: payload.messageText,
      createdBy: {
        _id: payload.userId,
      },
      chatRoom: payload.roomId,
      createdAt: time,
      updatedAt: time,
    });
  }

  async changeRoomOngoinCallStatus(payload: ISocketCallDto) {
    this.logger.debug('Making room call ongoing', JSON.stringify({ payload }));
    await this.chatRoomService.chatRoomModel.updateOne(
      { _id: payload.roomId },
      { $set: { isOngoingCall: payload.isOngoingCall } },
    );
  }
}
