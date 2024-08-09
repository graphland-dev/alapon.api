import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { SocketChatService } from './socket-chat.service';
import { ISendOrUpdateMessageSocketDto } from './dtos/socket.dto';
import { ChatMessageType } from '@/api/chat/chat-message/entities/chat-message.entity';

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

  constructor(private socketChatService: SocketChatService) {}

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

  // -------------------------------- Chat Room Events --------------------------------

  @SubscribeMessage('emit:chat:join-room')
  handle__emit__chat__joinRoom(
    @MessageBody()
    data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(data.roomId);
    console.log(`Client ${socket.id} joined room: ${data.roomId}`);
  }

  @SubscribeMessage('emit:chat:leave-room')
  handle__emit__chat__leaveRoom(
    @MessageBody()
    data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(data.roomId);
    console.log(`Client ${socket.id} leave room: ${data.roomId}`);
  }

  @SubscribeMessage('emit:chat:messages:send-message')
  // 🔌 -> 📢 `listen:chat:{roomId}:messages`
  handle__emit__chat__messages__sendMessage(
    @MessageBody()
    data: ISendOrUpdateMessageSocketDto,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.logger.debug(
      'emit:chat:messages:send-message',
      JSON.stringify({ data }),
    );
    this.socketChatService.sendMessageToChatRoom(socket, {
      ...data,
      messageType: ChatMessageType.USER_MESSAGE,
    });
  }

  @SubscribeMessage('emit:chat:messages:update-message')
  // 🔌 -> 📢 `listen:chat:{roomId}:messages:updated`
  handle__emit__chat__messages__updateMessage(
    @MessageBody()
    data: ISendOrUpdateMessageSocketDto,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.logger.debug(
      'emit:chat:messages:update-message',
      JSON.stringify({ data }),
    );
    this.socketChatService.updateMessageToChatRoom(socket, data);
  }

  @SubscribeMessage('emit:chat:initiate-call')
  // 🔌 -> 📢 listen:chat:{roomId}:call-incoming
  async handle__emit__chat__callOutgoing(
    @MessageBody()
    data: ISendOrUpdateMessageSocketDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    this.logger.debug('emit:chat:initiate-call', JSON.stringify({ data }));
    await this.socketChatService.changeRoomOngoinCallStatus(socket, {
      ...data,
      isOngoingCall: true,
    });
  }

  // // --------------------------------------------------------------------------------

  // @SubscribeMessage('join-socket')
  // loginUser(
  //   @MessageBody()
  //   data: { userId: string },
  //   @ConnectedSocket() socket: Socket,
  // ): void {
  //   socket.join(`user:${data.userId}`);
  //   this.logger.debug(`join-socket -> userId:${data.userId}`);
  // }

  // @SubscribeMessage('leave-socket')
  // logoutUser(
  //   @MessageBody()
  //   data: { userId: string },
  //   @ConnectedSocket() socket: Socket,
  // ): void {
  //   socket.leave(`user:${data.userId}`);
  //   this.logger.debug(`leave-socket -> userId:${data.userId}`);
  // }

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
