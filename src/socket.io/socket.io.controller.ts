import { Controller, Post } from '@nestjs/common';
import { SocketIoGateway } from './socket.io.gateway';

@Controller('socket')
export class SocketIoController {
  constructor(private readonly socketIoGateway: SocketIoGateway) {}
  @Post('send-message')
  async sendMsg() {
    this.socketIoGateway.broadCastMessage('notification', 'msg send');
    return 'msg send';
  }
}
