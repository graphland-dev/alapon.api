import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @ApiProperty()
  @IsNotEmpty()
  handle: string;

  @Field()
  @ApiProperty()
  @IsNotEmpty()
  pin: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  token: string;
}
