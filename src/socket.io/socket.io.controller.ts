import { Controller } from '@nestjs/common';
import { SocketIoGateway } from './socket.io.gateway';

@Controller('socket')
export class SocketIoController {
  constructor(private readonly socketIoGateway: SocketIoGateway) {}
}
