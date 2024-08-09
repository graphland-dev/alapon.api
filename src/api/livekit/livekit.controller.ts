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
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('api/livekit')
@ApiTags('Livekit')
export class LivekitController {
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
  async handleLivekitWebhook(@Req() req: Request) {
    try {
      // const webhookEvent: liveKit.WebhookEvent =
      //   this.livekitWebhookReceiver.receive(
      //     req?.body,
      //     req?.get('Authorization'),
      //   );

      console.log(JSON.stringify({ webhookBody: req.body }, null, 2));
      const webhookEvent = req.body as liveKit.WebhookEvent;

      switch (webhookEvent.event) {
        case 'room_started':
          // emit:
          break;
        case 'room_finished':
          break;
        case 'participant_joined':
          break;
        case 'participant_left':
          break;
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
