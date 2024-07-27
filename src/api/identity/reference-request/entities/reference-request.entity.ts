import { Paginated } from '@/common/common-models/pagination-object';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@/api/identity/user/entities/user.entity';

export enum ReferenceRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}
registerEnumType(ReferenceRequestStatus, { name: 'ReferenceRequestStatus' });

@ObjectType()
@Schema({
  timestamps: true,
  collection: 'identity__ReferenceRequest',
})
export class ReferenceRequest {
  @Field(() => ID)
  _id: string;

  @Field(() => User)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  requesterUser: User;

  @Field(() => User)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  referenceUser: User;

  @Field(() => ReferenceRequestStatus)
  @Prop()
  status: ReferenceRequestStatus;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

export type ReferenceRequestDocument = HydratedDocument<ReferenceRequest>;
export const ReferenceRequestSchema =
  SchemaFactory.createForClass(ReferenceRequest);

@ObjectType()
export class ReferenceRequestsWithPagination extends Paginated(
  ReferenceRequest,
) {}
