import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateChatGroupInput {
  @Field(() => String)
  @IsNotEmpty()
  handle: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isNsfw: boolean;
}

@InputType()
export class AddOrRemoveGroupModeratorInput {
  @Field(() => String)
  @IsNotEmpty()
  groupHandle: string;

  @Field(() => [String])
  @IsNotEmpty()
  moderatorHandles: string[];
}

@InputType()
export class GroupMemberMutationInput {
  @Field(() => String)
  @IsNotEmpty()
  groupHandle: string;

  @Field(() => [String])
  @IsNotEmpty()
  memberHandles: string[];
}

@InputType()
export class JoinOrLeaveGroupInput {
  @Field(() => String)
  @IsNotEmpty()
  groupHandle: string;
}

@InputType()
export class JoinInPersonInput {
  @Field(() => String)
  @IsNotEmpty()
  userHandle: string;

  @Field(() => String)
  @IsNotEmpty()
  messageText: string;
}
