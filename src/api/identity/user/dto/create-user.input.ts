import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class JoinUserInput {
  @Field(() => String)
  @IsNotEmpty()
  handle: number;

  @Field(() => String)
  @IsNotEmpty()
  referenceHandle: number;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  pin: number;
}
