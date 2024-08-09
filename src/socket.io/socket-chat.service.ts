import { ChatMessageType } from '@/api/chat/chat-message/entities/chat-message.entity';
import { ChatRoomService } from '@/api/chat/chat-room/chat-room.service';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocketServer } from '@nestjs/websockets';
import mongoose from 'mongoose';
import { Namespace, Socket } from 'socket.io';
import {
  ISendOrUpdateMessageSocketDto,
  ISocketCallInitiateDto,
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
    socket: Socket,
    payload: ISendOrUpdateMessageSocketDto,
  ) {
    const msgId = new mongoose.Types.ObjectId().toString();
    const time = new Date().toISOString();

    socket.broadcast
      .to(payload.roomId)
      .emit(`listen:chat:${payload.roomId}:messages`, {
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
    socket: Socket,
    payload: ISendOrUpdateMessageSocketDto,
  ) {
    const time = new Date().toISOString();

    socket.broadcast
      .to(payload.roomId)
      .emit(`listen:chat:${payload.roomId}:messages:updated`, {
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

  async changeRoomOngoinCallStatus(
    socket: Socket,
    payload: ISocketCallInitiateDto,
  ) {
    this.logger.debug('Making room call ongoing', JSON.stringify({ payload }));
    socket.broadcast
      .to(payload.roomId)
      .emit(`listen:chat:${payload.roomId}:call-incoming`, payload);
    await this.chatRoomService.chatRoomModel.updateOne(
      { _id: payload.roomId },
      { $set: { isOngoingCall: payload.isOngoingCall } },
    );
    this.sendMessageToChatRoom(socket, {
      messageType: ChatMessageType.SYSTEM_MESSAGE,
      roomId: payload?.roomId,
      roomHandle: payload?.roomHandle,
      userId: payload?.userId,
      messageText: `${payload.userHandle} started a call`,
      userHandle: payload?.userHandle,
    });
  }
}
