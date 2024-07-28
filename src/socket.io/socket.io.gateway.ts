import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
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
    this.logger.debug('Someone tryin to connect to socket');
    // const token = client.handshake?.headers?.token as string;

    // if (!token) {
    //   this.logger.error(
    //     'Failed to connect socket. Authorization token not passed',
    //   );
    //   client.disconnect();
    //   return;
    // }
    // const decoded = jwt.decode(token) as IAuthUser;

    // if (!decoded) {
    //   this.logger.error('Invalid token passed on socket connection');
    //   client.disconnect();
    //   return;
    // }

    this.logger.debug(`Client connected: ${client.id}`);
    this.logger.debug(`Client connected: ${this.io.sockets.size}`);
  }

  async handleDisconnect(client: Socket) {
    // const token = client.handshake?.headers?.token as string;
    // const decoded = jwt.decode(token) as IAuthUser;

    this.logger.debug(`Client disconnected: ${client.id}`);
    this.logger.debug(`Client connected: ${this.io.sockets.size}`);
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
    const event = 'events';
    return { event, data };
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
    this.io.emit(eventName, data);
    this.logger.debug(
      `Message send to all users`,
      JSON.stringify({
        eventName,
        data,
      }),
    );
  }
}
