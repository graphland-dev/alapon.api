import { Field, InputType, OmitType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ChatMessageType } from '../entities/chat-message.entity';

@InputType()
export class CreateChatMessageInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  text?: string;

  @Field(() => ChatMessageType, { nullable: true })
  @IsOptional()
  messageType?: ChatMessageType;

  @Field(() => String)
  @IsNotEmpty()
  roomId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  userId?: string;
}

@InputType()
export class SendMessageToRoomInput extends OmitType(CreateChatMessageInput, [
  'messageType',
]) {}
