import { Paginated } from '@/common/common-models/pagination-object';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export enum UserAccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
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

  @Field(() => String)
  @Prop()
  pin: string;

  @Field(() => String)
  @Prop()
  handle: string;

  @Field(() => String)
  @Prop()
  referenceHandle: string;

  @Field(() => String)
  @Prop()
  secret: string;

  @Prop({ default: UserAccountStatus.ACTIVE })
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
