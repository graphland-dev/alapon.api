import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateChatGroupInput {
  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  handle: number;

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
export class AddOrRemoveGroupMembersInput {
  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  groupHandle: string;

  @Field(() => [String])
  @ApiProperty()
  @IsNotEmpty()
  memberHandles: string[];
}
