import * as liveKit from 'livekit-server-sdk';

import { Authenticated } from '@/authorization/decorators/authenticated.decorator';
import {
  AuthenticatedUser,
  IAuthUser,
} from '@/authorization/decorators/user.decorator';
import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SocketIoGateway } from '@/socket.io/socket.io.gateway';

@Controller('api/livekit')
@ApiTags('Livekit')
export class LivekitController {
  constructor(private socketIoGateway: SocketIoGateway) {}

  livekitWebhookReceiver = new liveKit.WebhookReceiver(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
  );

  @Get('token')
  @Authenticated()
  getLiveKitToken(
    @Query('roomId') roomId: string,
    @AuthenticatedUser() authUser: IAuthUser,
  ) {
    const at = new liveKit.AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity: authUser.sub, name: `@${authUser.handle}` },
    );

    at.addGrant({
      room: roomId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });
    return { token: at.toJwt() };
  }

  @Post('webhook')
  async handleLivekitWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    try {
      // const body = JSON.parse(Buffer.from(req.body).toString());
      const webhookEvent: liveKit.WebhookEvent =
        this.livekitWebhookReceiver.receive(
          req?.body,
          req?.get('Authorization'),
        );

      switch (webhookEvent.event) {
        case 'room_started':
          console.log('room_started', webhookEvent);
          break;
        case 'room_finished':
          console.log('room_finished', webhookEvent);
          this.socketIoGateway.changeRoomOngoingCallStatus({
            roomId: webhookEvent.room.name,
            isOngoingCall: false,
          });
          break;
        // case 'participant_joined':
        //   break;
        // case 'participant_left':
        //   break;
      }

      return res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.log(error.message);
      throw new ForbiddenException(error.message);
    }
  }
}
