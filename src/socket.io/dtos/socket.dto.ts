import { IsNotEmpty } from 'class-validator';

export class SendMessageToRoom {
  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  message: string;
}
