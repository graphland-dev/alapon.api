import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateChatGroupInput {
  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  handle: string;

  @Field(() => Boolean)
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isNsfw: boolean;
}

@InputType()
export class AddOrRemoveGroupModeratorInput {
  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  groupHandle: string;

  @Field(() => [String])
  @ApiProperty()
  @IsNotEmpty()
  moderatorHandles: string[];
}

@InputType()
export class GroupMemberMutationInput {
  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  groupHandle: string;

  @Field(() => [String])
  @ApiProperty()
  @IsNotEmpty()
  memberHandles: string[];
}

@InputType()
export class JoinOrLeaveGroupInput {
  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  groupHandle: string;
}
