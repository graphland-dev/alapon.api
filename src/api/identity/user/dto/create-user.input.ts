import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class JoinUserInput {
  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  handle: number;

  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  referenceHandle: number;

  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  pin: number;
}
