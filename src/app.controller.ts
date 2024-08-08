import { Controller, Get, Query } from '@nestjs/common';
import * as liveKit from 'livekit-server-sdk';
import { Authenticated } from './authorization/decorators/authenticated.decorator';
import {
  AuthenticatedUser,
  IAuthUser,
} from './authorization/decorators/user.decorator';

@Controller('api')
export class AppController {
  @Get()
  getHello() {
    return {
      message: 'Blackout Chat API is healthy!!',
    };
  }

  @Get('livekit/token')
  @Authenticated()
  getLiveKitToken(
    @Query('roomId') roomId: string,
    @AuthenticatedUser() authUser: IAuthUser,
  ) {
    const at = new liveKit.AccessToken(
      'APIMyJ37ZGkNXFf',
      'avBDO30PeAYItWjKgjNctehpgdHh4AYNSNHgqvIv5pT',
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
}
