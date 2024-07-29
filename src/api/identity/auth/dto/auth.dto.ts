import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  handle: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  pin: string;
}

@InputType()
export class ResetPinInput {
  @Field()
  @IsNotEmpty()
  handle: string;

  @Field()
  @IsNotEmpty()
  secret: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  pin: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  token: string;
}

@ObjectType()
export class JoinUserResponse {
  @Field(() => String)
  @IsNotEmpty()
  secret: string;

  @Field(() => String)
  @IsNotEmpty()
  handle: string;
}

@InputType()
export class JoinUserInput {
  @Field(() => String)
  @IsNotEmpty()
  handle: string;

  @Field(() => String)
  @IsNotEmpty()
  referenceHandle: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  pin: number;
}
