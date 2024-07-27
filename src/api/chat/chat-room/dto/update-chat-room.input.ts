import { CreateChatRoomInput } from './create-chat-room.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateChatRoomInput extends PartialType(CreateChatRoomInput) {
  @Field(() => Int)
  id: number;
}
