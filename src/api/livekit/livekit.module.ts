import { SocketIoModule } from '@/socket.io/socket.io.module';
import { Module } from '@nestjs/common';
import { LivekitController } from './livekit.controller';

@Module({
  controllers: [LivekitController],
  imports: [SocketIoModule],
})
export class LivekitModule {}
