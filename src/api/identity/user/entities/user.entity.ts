import { Paginated } from '@/common/common-models/pagination-object';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export enum UserAccountStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}
registerEnumType(UserAccountStatus, { name: 'UserAccountStatus' });

@ObjectType()
@Schema({
  timestamps: true,
  collection: 'identity__User',
})
export class User {
  @Field(() => ID)
  _id: string;

  @Prop()
  pin: string;

  @Field(() => String)
  @Prop({ lowercase: true })
  handle: string;

  @Field(() => String, { nullable: true })
  @Prop()
  referenceHandle: string;

  // @Field(() => String)
  @Prop()
  secret: string;

  @Prop({ default: UserAccountStatus.PENDING })
  @Field(() => UserAccountStatus, { nullable: true })
  accountStatus?: UserAccountStatus;

  @Field(() => Date, { nullable: true })
  @Prop()
  lastLoginAt?: Date;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

@ObjectType()
export class UsersWithPagination extends Paginated(User) {}
