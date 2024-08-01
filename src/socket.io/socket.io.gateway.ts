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
    console.log(`Client ${client.id} joined room: ${roomId}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: Socket, roomId: string): void {
    client.leave(roomId);
    console.log(`Client ${client.id} left room: ${roomId}`);
  }

  @SubscribeMessage('join-socket')
  loginUser(
    @MessageBody()
    data: { userId: string },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.join(`user:${data.userId}`);
    this.logger.debug(`join-socket -> userId:${data.userId}`);
  }

  @SubscribeMessage('leave-socket')
  logoutUser(
    @MessageBody()
    data: { userId: string },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.leave(`user:${data.userId}`);
    this.logger.debug(`leave-socket -> userId:${data.userId}`);
  }

  /**
   * Send message to user
   * @param userId - user id
   * @param channel - channel name
   * @param message - message to send
   */
  sendSocketMessageToUser(userId: string, channel: string, message: any) {
    this.io.to(`user:${userId}`).emit(channel, message);
    this.logger.debug(
      `Message send to user: ${userId} -> ${channel} -> ${JSON.stringify(
        message,
      )}`,
    );
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

  @SubscribeMessage('send-room-message')
  async handleSendRoomMessage(
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
      createdBy: {
        handle: data.userHandle,
        _id: data.userId,
      },
      chatRoom: data.roomId,
      createdAt: time,
      updatedAt: time,
    });
  }

  /**
   * Broadcast message to all connected users
   * @param eventName - event name
   * @param data - data to send
   */
  async broadCastMessage(eventName: string, data: any) {
    this.logger.debug(
      `Message send to all users`,
      JSON.stringify({
        eventName,
        data,
      }),
    );
    return this.io.emit(eventName, data);
  }
}
