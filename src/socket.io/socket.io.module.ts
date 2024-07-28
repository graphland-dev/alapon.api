import { Module } from '@nestjs/common';
import { SocketIoController } from './socket.io.controller';
import { SocketIoGateway } from './socket.io.gateway';
import { SocketIoService } from './socket.io.service';

@Module({
  providers: [SocketIoGateway, SocketIoService],
  controllers: [SocketIoController],
  exports: [SocketIoGateway],
})
export class SocketIoModule {}
