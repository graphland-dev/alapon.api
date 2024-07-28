import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @ApiProperty()
  @IsNotEmpty()
  handle: string;

  @Field()
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  pin: string;
}

@InputType()
export class ResetPinInput {
  @Field()
  @ApiProperty()
  @IsNotEmpty()
  handle: string;

  @Field()
  @ApiProperty()
  @IsNotEmpty()
  secret: string;

  @Field()
  @ApiProperty()
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
  @ApiProperty()
  @IsNotEmpty()
  secret: string;

  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  handle: string;
}

@InputType()
export class JoinUserInput {
  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  handle: string;

  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  referenceHandle: string;

  @Field(() => String)
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  pin: number;
}
