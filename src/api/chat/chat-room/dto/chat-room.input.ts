import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateChatGroupInput {
  @Field(() => String)
  @IsNotEmpty()
  handle: string;

  @Field(() => Boolean)
  @IsNotEmpty()
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
}
