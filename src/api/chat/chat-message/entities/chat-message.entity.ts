import { User } from '@/api/identity/user/entities/user.entity';
import { Paginated } from '@/common/common-models/pagination-object';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ChatRoom } from '../../chat-room/entities/chat-room.entity';

export enum ChatMessageType {
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
  USER_MESSAGE = 'USER_MESSAGE',
}
registerEnumType(ChatMessageType, { name: 'ChatMessageType' });

@ObjectType()
@Schema({
  timestamps: true,
  collection: 'chat__ChatMessage',
})
export class ChatMessage {
  @Field(() => ID)
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: string;

  @Field(() => ChatMessageType, { nullable: true })
  @Prop({ default: ChatMessageType.USER_MESSAGE })
  messageType: ChatMessageType;

  @Field(() => String, { nullable: true })
  @Prop()
  text: string;

  @Field(() => User, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: string;

  @Field(() => ChatRoom, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' })
  chatRoom: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

export type ChatMessageDocument = HydratedDocument<ChatMessage>;
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

ChatMessageSchema.pre('save', function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId().toString();
  }
  next();
});

@ObjectType()
export class ChatMessagesWithPagination extends Paginated(ChatMessage) {}
