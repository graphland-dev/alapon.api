import { ChatMessageType } from '@/api/chat/chat-message/entities/chat-message.entity';
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
import {
  ISendOrUpdateMessageSocketDto,
  ISocketCallDto,
} from './dtos/socket.dto';
import { SocketChatService } from './socket-chat.service';

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
    this.logger.log(
      'handle__emit__chat__messages__sendMessage->emit:chat:messages:send-message',
      JSON.stringify({ data }, null, 2),
    );

    this.socketChatService.sendMessageToChatRoom(
      (socketCallbackPayload) => {
        console.log(
          `🔥 broadcast:chat:${data.roomId}:messages`,
          socketCallbackPayload,
        );
        socket
          .to(data.roomId)
          .emit(`listen:chat:${data.roomId}:messages`, socketCallbackPayload);
      },
      {
        ...data,
        messageType: ChatMessageType.USER_MESSAGE,
      },
    );
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
    this.socketChatService.updateMessageToChatRoom(
      (socketCallbackPayload) =>
        socket.broadcast
          .to(data.roomId)
          .emit(
            `listen:chat:${data.roomId}:messages:updated`,
            socketCallbackPayload,
          ),
      data,
    );
  }

  @SubscribeMessage('emit:chat:initiate-call')
  // 🔌 -> 📢 listen:chat:{roomId}:call-incoming
  async handle__emit__chat__callOutgoing(
    @MessageBody()
    payload: ISocketCallDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    this.logger.log(
      'emit:chat:initiate-call',
      JSON.stringify({ payload }, null, 2),
    );
    await this.socketChatService.changeRoomOngoinCallStatus({
      ...payload,
      isOngoingCall: true,
    });

    await this.socketChatService.sendMessageToChatRoom(
      (socketCallbackPayload) =>
        socket
          .to(payload.roomId)
          .emit(
            `listen:chat:${payload.roomId}:messages`,
            socketCallbackPayload,
          ),
      {
        messageType: ChatMessageType.SYSTEM_MESSAGE,
        roomId: payload?.roomId,
        roomHandle: payload?.roomHandle,
        userId: payload?.userId,
        messageText: `${payload.userHandle} started a call`,
        userHandle: payload?.userHandle,
      },
    );

    socket.broadcast
      .to(payload.roomId)
      .emit(`listen:chat:${payload.roomId}:ongoing-call`, {
        ...payload,
        isOngoingCall: true,
      });
  }

  @SubscribeMessage('emit:chat:join-call')
  // 🔌 -> 📢 listen:chat:{roomId}:call-incoming
  async handle__emit__chat__JoinCall(
    @MessageBody()
    payload: ISocketCallDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    this.logger.log(
      'emit:chat:join-call',
      JSON.stringify({ payload }, null, 2),
    );

    await this.socketChatService.sendMessageToChatRoom(
      (socketCallbackPayload) =>
        socket
          .to(payload.roomId)
          .emit(
            `listen:chat:${payload.roomId}:messages`,
            socketCallbackPayload,
          ),
      {
        messageType: ChatMessageType.SYSTEM_MESSAGE,
        roomId: payload?.roomId,
        roomHandle: payload?.roomHandle,
        userId: payload?.userId,
        messageText: `${payload.userHandle} joined to the call`,
        userHandle: payload?.userHandle,
      },
    );

    socket.broadcast
      .to(payload.roomId)
      .emit(`listen:chat:${payload.roomId}:ongoing-call`, {
        ...payload,
        isOngoingCall: true,
      });
  }

  @SubscribeMessage('emit:chat:leave-call')
  // 🔌 -> 📢 listen:chat:{roomId}:call-incoming
  async handle__emit__chat__LeaveCall(
    @MessageBody()
    payload: ISocketCallDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    this.logger.log(
      'emit:chat:leave-call',
      JSON.stringify({ payload }, null, 2),
    );

    await this.socketChatService.sendMessageToChatRoom(
      (socketCallbackPayload) =>
        socket
          .to(payload.roomId)
          .emit(
            `listen:chat:${payload.roomId}:messages`,
            socketCallbackPayload,
          ),
      {
        messageType: ChatMessageType.SYSTEM_MESSAGE,
        roomId: payload?.roomId,
        roomHandle: payload?.roomHandle,
        userId: payload?.userId,
        messageText: `${payload.userHandle} left the call`,
        userHandle: payload?.userHandle,
      },
    );

    // socket.broadcast
    //   .to(payload.roomId)
    //   .emit(`listen:chat:${payload.roomId}:ongoing-call`, {
    //     ...payload,
    //     isOngoingCall: false,
    //   });
  }

  // // --------------------------------------------------------------------------------
  async changeRoomOngoingCallStatus(
    @MessageBody()
    payload: ISocketCallDto,
  ): Promise<void> {
    await this.socketChatService.changeRoomOngoinCallStatus(payload);

    await this.socketChatService.sendMessageToChatRoom(
      (payload) =>
        this.io
          .to(payload.roomId)
          .emit(`listen:chat:${payload.roomId}:messages`, payload),
      {
        messageType: ChatMessageType.SYSTEM_MESSAGE,
        roomId: payload?.roomId,
        roomHandle: payload?.roomHandle,
        userId: payload?.userId,
        messageText: `Call room ended`,
        userHandle: payload?.userHandle,
      },
    );

    this.io
      .to(payload.roomId)
      .emit(`listen:chat:${payload.roomId}:ongoing-call`, payload, payload);
  }

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
