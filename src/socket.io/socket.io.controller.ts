import { Body, Controller, Post } from '@nestjs/common';
import { SocketIoGateway } from './socket.io.gateway';
import { SendMessageToRoom } from './dtos/socket.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Socket')
@Controller('socket')
export class SocketIoController {
  constructor(private readonly socketIoGateway: SocketIoGateway) {}
  @Post('send-message-to-room')
  async sendMessageToRoom(@Body() body: SendMessageToRoom) {
    return this.socketIoGateway.broadCastMessage(
      `room-messages:${body.roomId}`,
      body.message,
    );
  }
}
