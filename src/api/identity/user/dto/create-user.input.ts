import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

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
  @MinLength(6)
  @MaxLength(6)
  pin: number;
}
