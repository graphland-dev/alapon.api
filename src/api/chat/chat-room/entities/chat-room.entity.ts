import { User } from '@/api/identity/user/entities/user.entity';
import { Paginated } from '@/common/common-models/pagination-object';
import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';
import { ChatMessage } from '../../chat-message/entities/chat-message.entity';

export enum ChatRoomType {
  GROUP = 'GROUP',
  PRIVATE = 'PRIVATE',
}
registerEnumType(ChatRoomType, { name: 'ChatRoomType' });

@ObjectType()
@Schema({
  timestamps: true,
  collection: 'chat__ChatRoom',
})
export class ChatRoom {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { nullable: true })
  @Prop({ lowercase: true })
  handle: string;

  @Field(() => Boolean, { nullable: true })
  @Prop({ default: false })
  isNsfw: boolean;

  @Field(() => ChatRoomType, { nullable: true })
  @Prop()
  roomType: ChatRoomType;

  @Field(() => User, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  owner: string;

  @Field(() => User, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  lastMessageSender: string;

  @Field(() => ChatMessage, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' })
  lastMessage: string;

  @Field(() => [User], { nullable: true })
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  moderators: User[];

  @Field(() => [User], { nullable: true })
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  members: User[];

  @Field(() => [User], { nullable: true })
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  kickedUsers: User[];

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

export type ChatRoomDocument = HydratedDocument<ChatRoom>;
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);

@ObjectType()
export class ChatRoomsWithPagination extends Paginated(ChatRoom) {}

@ObjectType()
export class ChatRoomDetails extends ChatRoom {
  @Field(() => Int, { nullable: true })
  memberCount: number;
}
