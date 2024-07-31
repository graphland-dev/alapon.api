import { ChatMessageType } from '@/api/chat/chat-message/entities/chat-message.entity';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import mongoose from 'mongoose';
import { Namespace, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'socket',
  cors: {
    origin: '*',
  },
})
export class SocketIoGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public io: Namespace;
  private logger: Logger = new Logger('SocketGateway');

  constructor(private eventEmitter: EventEmitter2) {}

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
    this.logger.debug(`Client connected: ${this.io.sockets.size}`);
  }

  async handleConnection(client: Socket) {
    // const token = client.handshake?.headers?.token as string;
    // const decoded = jwt.decode(token) as IAuthUser;
    this.logger.debug('Someone tryin to connect to socket');
    this.logger.debug(`Client connected: ${client.id}`);
    this.logger.debug(`Client connected: ${this.io.sockets.size}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, roomId: string): void {
    client.join(roomId);
    this.io.to(roomId).emit('room-online-count', this.io.sockets.size);
    console.log(`Client ${client.id} joined room: ${roomId}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: Socket, roomId: string): void {
    client.leave(roomId);
    console.log(`Client ${client.id} left room: ${roomId}`);
  }

  async sendMessageToSocketClients(
    clientIds: string[],
    eventName: string,
    message: string,
  ) {
    this.io.to(clientIds).emit(eventName, message);
    this.logger.debug(
      `Message send to user: ${clientIds} -> ${JSON.stringify(clientIds)}`,
    );
  }

  /**
   * Broadcast message to all connected users
   * @param eventName - event name
   * @param data - data to send
   */
  async broadCastMessage(eventName: string, data: string) {
    this.logger.debug(
      `Message send to all users`,
      JSON.stringify({
        eventName,
        data,
      }),
    );
    return this.io.emit(eventName, data);
  }

  @SubscribeMessage('send-room-message')
  async getRoomMessageFromClient(
    @MessageBody()
    data: {
      roomId: string;
      userId: string;
      messageText: string;
      userHandle: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    const msgId = new mongoose.Types.ObjectId().toString();
    const time = new Date().toISOString();

    // console.log(client);
    // this.io.to(data.roomId).emit(`room-messages:${data.roomId}`, {});

    socket.broadcast.to(data.roomId).emit(`room-messages:${data.roomId}`, {
      _id: msgId,
      messageType: ChatMessageType.USER_MESSAGE,
      createdBy: {
        handle: data.userHandle,
        _id: data.userId,
      },
      chatRoom: {
        _id: data.roomId,
      },
      text: data.messageText,
      createdAt: time,
      updatedAt: time,
    });

    this.eventEmitter.emit('message-send-to-room', {
      _id: msgId,
      messageType: 'USER_MESSAGE',
      text: data.messageText,
      createdBy: data.userId,
      chatRoom: data.roomId,
      createdAt: time,
      updatedAt: time,
    });
  }
}
