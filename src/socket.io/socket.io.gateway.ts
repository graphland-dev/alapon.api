import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
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
  connectedClients = new Map<string, string[]>();

  constructor() {}

  async handleConnection(client: Socket) {
    // const token = client.handshake?.headers?.token as string;
    // const decoded = jwt.decode(token) as IAuthUser;
    this.logger.debug('Someone tryin to connect to socket');
    this.logger.debug(`Client connected: ${client.id}`);
    this.logger.debug(`Client connected: ${this.io.sockets.size}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
    this.logger.debug(`Client connected: ${this.io.sockets.size}`);
  }

  // @SubscribeMessage('join-room')
  // async handleJoinRoom(
  //   @MessageBody() data: { roomId: string; userId: string },
  // ) {
  //   this.io.socketsJoin(data.roomId);
  //   this.logger.debug(`User joined room: ${data.roomId}`);
  // }

  // @SubscribeMessage('leave-room')
  // async handleLeaveRoom(
  //   @MessageBody() data: { roomId: string; userId: string },
  // ) {
  //   this.io.socketsLeave(data.roomId);
  //   this.logger.debug(`User left room: ${data.roomId}`);
  // }

  // handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
  //   const event = 'events';
  //   return { event, data };
  // }

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
}
