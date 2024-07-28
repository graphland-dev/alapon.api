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
