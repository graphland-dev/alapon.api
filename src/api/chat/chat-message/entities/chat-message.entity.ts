import { Paginated } from '@/common/common-models/pagination-object';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@ObjectType()
@Schema({
  timestamps: true,
  collection: 'chat__ChatMessage',
})
export class ChatMessage {
  @Field(() => ID)
  _id: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

export type ChatMessageDocument = HydratedDocument<ChatMessage>;
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

@ObjectType()
export class ChatMessagesWithPagination extends Paginated(ChatMessage) {}
