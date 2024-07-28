import { Field, InputType, OmitType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ChatMessageType } from '../entities/chat-message.entity';

@InputType()
export class CreateChatMessageInput {
  @Field(() => String, { nullable: true })
  @ApiProperty()
  @IsOptional()
  text?: string;

  @Field(() => ChatMessageType, { nullable: true })
  @ApiProperty()
  @IsOptional()
  messageType?: ChatMessageType;

  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  roomId: ChatMessageType;

  @Field(() => String, { nullable: true })
  @ApiProperty()
  @IsOptional()
  userId: string;
}

@InputType()
export class SendMessageToRoomInput extends OmitType(CreateChatMessageInput, [
  'messageType',
]) {}
